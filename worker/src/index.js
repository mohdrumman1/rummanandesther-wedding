const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' };
const RSVP_DEADLINE = '2026-08-15';

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

function allowedOrigin(request, env) {
  const origin = request.headers.get('Origin');
  if (!origin) return '*';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(item => item.trim()).filter(Boolean);
  return allowed.includes(origin) ? origin : '';
}

function corsHeaders(request, env) {
  const origin = allowedOrigin(request, env);
  return {
    ...(origin ? { 'access-control-allow-origin': origin } : {}),
    'access-control-allow-methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'access-control-allow-headers': 'content-type,authorization',
    'access-control-max-age': '86400',
    vary: 'Origin',
  };
}

function withCors(response, request, env) {
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders(request, env)).forEach(([key, value]) => headers.set(key, value));
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function randomId(prefix = '') {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return `${prefix}${Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')}`;
}

function randomAccessCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => alphabet[byte % alphabet.length]).join('');
}

function asBool(value) {
  return value === 1 ? true : value === 0 ? false : null;
}

function boolToDb(value) {
  if (value === true) return 1;
  if (value === false) return 0;
  return null;
}

function normalizeName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function guestRow(row) {
  return {
    id: row.id,
    name: row.name,
    isPrimary: row.is_primary === 1,
    isPartner: row.is_partner === 1,
    isAdditional: row.is_additional === 1,
    primaryGuestId: row.primary_guest_id,
    childrenAllowed: row.children_allowed === 1,
    maxChildren: row.max_children,
    childrenCount: row.children_count,
    sangeetAttending: asBool(row.sangeet_attending),
    ceremonyAttending: asBool(row.ceremony_attending),
  };
}

function groupRow(row, guests = [], notes = null) {
  return {
    id: row.id,
    householdName: row.household_name,
    accessCode: row.access_code,
    plusOneLimit: row.plus_one_limit,
    notes: row.notes || '',
    guests: guests.map(guestRow),
    rsvp: {
      dietaryRequirements: notes?.dietary_requirements || '',
      message: notes?.message || '',
      submittedAt: notes?.submitted_at || null,
    },
    rsvpDeadline: RSVP_DEADLINE,
  };
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(sig), byte => byte.toString(16).padStart(2, '0')).join('');
}

function base64UrlEncode(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return JSON.parse(new TextDecoder().decode(bytes));
}

async function createToken(env) {
  const payload = { role: 'admin', exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 };
  const encoded = base64UrlEncode(payload);
  const signature = await sign(encoded, env.SESSION_SECRET);
  return `${encoded}.${signature}`;
}

async function requireAdmin(request, env) {
  const header = request.headers.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature || !env.SESSION_SECRET) return false;
  const expected = await sign(encoded, env.SESSION_SECRET);
  if (signature !== expected) return false;
  try {
    const payload = base64UrlDecode(encoded);
    return payload.role === 'admin' && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

async function fetchGroupByAccessCode(env, accessCode) {
  const group = await env.DB.prepare('SELECT * FROM guest_groups WHERE access_code = ?').bind(accessCode).first();
  if (!group) return null;
  const guests = await env.DB.prepare('SELECT * FROM guests WHERE group_id = ? ORDER BY sort_order, created_at').bind(group.id).all();
  const notes = await env.DB.prepare('SELECT * FROM rsvp_notes WHERE group_id = ?').bind(group.id).first();
  return groupRow(group, guests.results || [], notes);
}

async function handleRsvpGet(request, env, accessCode) {
  const group = await fetchGroupByAccessCode(env, accessCode);
  if (!group) return json({ error: 'RSVP link not found.' }, 404);
  const publicGroup = { ...group };
  delete publicGroup.id;
  return json(publicGroup);
}

async function handleRsvpPost(request, env, accessCode) {
  const body = await readJson(request);
  if (!body || !Array.isArray(body.guests)) return json({ error: 'Invalid RSVP payload.' }, 400);

  const group = await env.DB.prepare('SELECT * FROM guest_groups WHERE access_code = ?').bind(accessCode).first();
  if (!group) return json({ error: 'RSVP link not found.' }, 404);

  const currentGuests = await env.DB.prepare('SELECT * FROM guests WHERE group_id = ?').bind(group.id).all();
  const currentById = new Map((currentGuests.results || []).map(guest => [guest.id, guest]));
  const existingAdditional = (currentGuests.results || []).filter(guest => guest.is_additional === 1).length;
  const additionalNames = Array.isArray(body.additionalGuests)
    ? body.additionalGuests.map(normalizeName).filter(Boolean).slice(0, 10)
    : [];
  const remainingSlots = Math.max(0, group.plus_one_limit - existingAdditional);
  if (additionalNames.length > remainingSlots) {
    return json({ error: `Only ${remainingSlots} additional guest${remainingSlots === 1 ? '' : 's'} can be added.` }, 400);
  }

  const statements = [];
  for (const submitted of body.guests) {
    const guest = currentById.get(submitted.id);
    if (!guest) continue;
    const childCount = guest.children_allowed === 1
      ? Math.max(0, Math.min(Number(submitted.childrenCount || 0), guest.max_children || 0))
      : 0;
    statements.push(env.DB.prepare(`
      UPDATE guests
      SET sangeet_attending = ?, ceremony_attending = ?, children_count = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND group_id = ?
    `).bind(
      boolToDb(submitted.sangeetAttending),
      boolToDb(submitted.ceremonyAttending),
      childCount,
      guest.id,
      group.id,
    ));
  }

  additionalNames.forEach((name, index) => {
    statements.push(env.DB.prepare(`
      INSERT INTO guests (
        id, group_id, name, is_primary, is_partner, is_additional,
        children_allowed, max_children, children_count,
        sangeet_attending, ceremony_attending, sort_order
      )
      VALUES (?, ?, ?, 0, 0, 1, 0, 0, 0, 1, 1, ?)
    `).bind(randomId('gst_'), group.id, name, 1000 + existingAdditional + index));
  });

  statements.push(env.DB.prepare(`
    INSERT INTO rsvp_notes (group_id, dietary_requirements, message, submitted_at, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(group_id) DO UPDATE SET
      dietary_requirements = excluded.dietary_requirements,
      message = excluded.message,
      submitted_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
  `).bind(group.id, String(body.dietaryRequirements || '').trim(), String(body.message || '').trim()));

  await env.DB.batch(statements);
  const updated = await fetchGroupByAccessCode(env, accessCode);
  const publicGroup = { ...updated };
  delete publicGroup.id;
  return json({ ok: true, group: publicGroup });
}

async function listGroups(env) {
  const groups = await env.DB.prepare(`
    SELECT
      gg.*,
      rn.dietary_requirements,
      rn.message,
      rn.submitted_at
    FROM guest_groups gg
    LEFT JOIN rsvp_notes rn ON rn.group_id = gg.id
    ORDER BY gg.household_name
  `).all();

  const guests = await env.DB.prepare('SELECT * FROM guests ORDER BY sort_order, created_at').all();
  const guestsByGroup = new Map();
  (guests.results || []).forEach(guest => {
    const list = guestsByGroup.get(guest.group_id) || [];
    list.push(guest);
    guestsByGroup.set(guest.group_id, list);
  });

  return (groups.results || []).map(group => ({
    ...groupRow(group, guestsByGroup.get(group.id) || [], {
      dietary_requirements: group.dietary_requirements,
      message: group.message,
      submitted_at: group.submitted_at,
    }),
    id: group.id,
  }));
}

async function handleAdminLogin(request, env) {
  const body = await readJson(request);
  if (!body?.password) return json({ error: 'Password is required.' }, 400);
  const configuredHash = env.ADMIN_PASSWORD_HASH;
  const configuredPassword = env.ADMIN_PASSWORD;
  const valid = configuredHash
    ? await sha256Hex(body.password) === configuredHash
    : configuredPassword && body.password === configuredPassword;
  if (!valid) return json({ error: 'Incorrect password.' }, 401);
  if (!env.SESSION_SECRET) return json({ error: 'SESSION_SECRET is not configured.' }, 500);
  return json({ token: await createToken(env) });
}

async function handleAdminGroupsGet(env) {
  return json({ groups: await listGroups(env) });
}

async function handleAdminGroupCreate(request, env) {
  const body = await readJson(request);
  const householdName = normalizeName(body?.householdName);
  if (!householdName) return json({ error: 'Household name is required.' }, 400);
  const groupId = randomId('grp_');
  const accessCode = body.accessCode ? normalizeName(body.accessCode).toUpperCase() : randomAccessCode();
  await env.DB.prepare(`
    INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, notes)
    VALUES (?, ?, ?, ?, ?)
  `).bind(groupId, householdName, accessCode, Math.max(0, Number(body.plusOneLimit || 0)), String(body.notes || '').trim()).run();

  const guests = Array.isArray(body.guests) ? body.guests : [];
  const statements = guests.map((guest, index) => env.DB.prepare(`
    INSERT INTO guests (
      id, group_id, name, is_primary, is_partner, is_additional,
      primary_guest_id, children_allowed, max_children, sort_order
    )
    VALUES (?, ?, ?, ?, ?, 0, NULL, ?, ?, ?)
  `).bind(
    randomId('gst_'),
    groupId,
    normalizeName(guest.name),
    guest.isPartner ? 0 : 1,
    guest.isPartner ? 1 : 0,
    guest.childrenAllowed ? 1 : 0,
    Math.max(0, Number(guest.maxChildren || 0)),
    index,
  )).filter((_, index) => normalizeName(guests[index]?.name));
  if (statements.length) await env.DB.batch(statements);
  return json({ ok: true, group: (await listGroups(env)).find(group => group.id === groupId) }, 201);
}

async function replaceGroupGuests(env, groupId, guests) {
  await env.DB.prepare('DELETE FROM guests WHERE group_id = ?').bind(groupId).run();
  const statements = guests
    .map((guest, index) => ({ guest, name: normalizeName(guest.name), index }))
    .filter(item => item.name)
    .map(({ guest, name, index }) => env.DB.prepare(`
      INSERT INTO guests (
        id, group_id, name, is_primary, is_partner, is_additional,
        primary_guest_id, children_allowed, max_children, children_count,
        sangeet_attending, ceremony_attending, sort_order
      )
      VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?)
    `).bind(
      guest.id || randomId('gst_'),
      groupId,
      name,
      guest.isPartner ? 0 : guest.isAdditional ? 0 : 1,
      guest.isPartner ? 1 : 0,
      guest.isAdditional ? 1 : 0,
      guest.childrenAllowed ? 1 : 0,
      Math.max(0, Number(guest.maxChildren || 0)),
      Math.max(0, Number(guest.childrenCount || 0)),
      boolToDb(guest.sangeetAttending),
      boolToDb(guest.ceremonyAttending),
      index,
    ));
  if (statements.length) await env.DB.batch(statements);
}

async function handleAdminGroupPatch(request, env, groupId) {
  const body = await readJson(request);
  const existing = await env.DB.prepare('SELECT * FROM guest_groups WHERE id = ?').bind(groupId).first();
  if (!existing) return json({ error: 'Group not found.' }, 404);
  const householdName = normalizeName(body?.householdName);
  if (!householdName) return json({ error: 'Household name is required.' }, 400);
  await env.DB.prepare(`
    UPDATE guest_groups
    SET household_name = ?, plus_one_limit = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(householdName, Math.max(0, Number(body.plusOneLimit || 0)), String(body.notes || '').trim(), groupId).run();
  if (Array.isArray(body.guests)) await replaceGroupGuests(env, groupId, body.guests);
  return json({ ok: true, group: (await listGroups(env)).find(group => group.id === groupId) });
}

async function handleAdminGroupDelete(env, groupId) {
  await env.DB.prepare('DELETE FROM guest_groups WHERE id = ?').bind(groupId).run();
  return json({ ok: true });
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted && char === '"' && next === '"') {
      value += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ',') {
      row.push(value);
      value = '';
    } else if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(value);
      if (row.some(cell => cell.trim())) rows.push(row);
      row = [];
      value = '';
    } else {
      value += char;
    }
  }
  row.push(value);
  if (row.some(cell => cell.trim())) rows.push(row);
  return rows;
}

async function handleAdminImport(request, env) {
  const body = await readJson(request);
  const csv = String(body?.csv || '').trim();
  if (!csv) return json({ error: 'CSV is required.' }, 400);
  const rows = parseCsv(csv);
  const header = rows.shift()?.map(cell => cell.trim().toLowerCase()) || [];
  const idx = name => header.indexOf(name);
  const required = ['household', 'guest'];
  if (required.some(name => idx(name) === -1)) {
    return json({ error: 'CSV must include household and guest columns.' }, 400);
  }

  const grouped = new Map();
  rows.forEach(row => {
    const household = normalizeName(row[idx('household')]);
    const guest = normalizeName(row[idx('guest')]);
    if (!household || !guest) return;
    const group = grouped.get(household) || {
      householdName: household,
      plusOneLimit: Number(row[idx('plus_one_limit')] || 0),
      notes: row[idx('notes')] || '',
      guests: [],
    };
    group.guests.push({
      name: guest,
      isPartner: /^(yes|true|1)$/i.test(row[idx('partner')] || ''),
      childrenAllowed: /^(yes|true|1)$/i.test(row[idx('children_allowed')] || ''),
      maxChildren: Number(row[idx('max_children')] || 0),
    });
    grouped.set(household, group);
  });

  let imported = 0;
  for (const group of grouped.values()) {
    const groupId = randomId('grp_');
    await env.DB.prepare(`
      INSERT INTO guest_groups (id, household_name, access_code, plus_one_limit, notes)
      VALUES (?, ?, ?, ?, ?)
    `).bind(groupId, group.householdName, randomAccessCode(), Math.max(0, group.plusOneLimit), group.notes).run();
    await replaceGroupGuests(env, groupId, group.guests);
    imported += 1;
  }
  return json({ ok: true, imported, groups: await listGroups(env) });
}

function csvEscape(value) {
  const string = String(value ?? '');
  return /[",\n\r]/.test(string) ? `"${string.replace(/"/g, '""')}"` : string;
}

async function handleAdminExport(env) {
  const groups = await listGroups(env);
  const rows = [['household', 'guest', 'sangeet', 'ceremony', 'children', 'dietary', 'message', 'submitted_at', 'invite_link']];
  groups.forEach(group => {
    group.guests.forEach(guest => {
      rows.push([
        group.householdName,
        guest.name,
        guest.sangeetAttending === null ? 'pending' : guest.sangeetAttending ? 'yes' : 'no',
        guest.ceremonyAttending === null ? 'pending' : guest.ceremonyAttending ? 'yes' : 'no',
        guest.childrenCount,
        group.rsvp.dietaryRequirements,
        group.rsvp.message,
        group.rsvp.submittedAt || '',
        `/rsvp/${group.accessCode}`,
      ]);
    });
  });
  return new Response(rows.map(row => row.map(csvEscape).join(',')).join('\n'), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="rsvp-export.csv"',
    },
  });
}

async function route(request, env) {
  const url = new URL(request.url);
  const method = request.method;
  const parts = url.pathname.split('/').filter(Boolean);

  if (method === 'OPTIONS') return new Response(null, { status: 204 });
  if (parts[0] !== 'api') return json({ error: 'Not found.' }, 404);

  if (parts[1] === 'health') return json({ ok: true });

  if (parts[1] === 'rsvp' && parts[2]) {
    if (method === 'GET') return handleRsvpGet(request, env, parts[2]);
    if (method === 'POST') return handleRsvpPost(request, env, parts[2]);
  }

  if (parts[1] === 'admin' && parts[2] === 'login' && method === 'POST') return handleAdminLogin(request, env);

  if (parts[1] === 'admin') {
    if (!await requireAdmin(request, env)) return json({ error: 'Admin login required.' }, 401);
    if (parts[2] === 'groups' && method === 'GET') return handleAdminGroupsGet(env);
    if (parts[2] === 'groups' && method === 'POST') return handleAdminGroupCreate(request, env);
    if (parts[2] === 'groups' && parts[3] && method === 'PATCH') return handleAdminGroupPatch(request, env, parts[3]);
    if (parts[2] === 'groups' && parts[3] && method === 'DELETE') return handleAdminGroupDelete(env, parts[3]);
    if (parts[2] === 'import' && method === 'POST') return handleAdminImport(request, env);
    if (parts[2] === 'export' && method === 'GET') return handleAdminExport(env);
  }

  return json({ error: 'Not found.' }, 404);
}

export default {
  async fetch(request, env) {
    try {
      const response = await route(request, env);
      return withCors(response, request, env);
    } catch (error) {
      return withCors(json({ error: error.message || 'Unexpected server error.' }, 500), request, env);
    }
  },
};
