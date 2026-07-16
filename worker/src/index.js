const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' };
const NO_STORE_HEADERS = { 'cache-control': 'no-store' };
const RSVP_DEADLINE = '2026-08-15';

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

function html(content, status = 200) {
  return new Response(content, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8' },
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
    childrenCount: Math.max(row.ceremony_children_count || 0, row.reception_children_count || 0),
    ceremonyChildrenCount: row.ceremony_children_count || 0,
    receptionChildrenCount: row.reception_children_count || 0,
    sangeetAttending: asBool(row.sangeet_attending),
    ceremonyAttending: asBool(row.ceremony_attending),
    receptionAttending: asBool(row.reception_attending),
    sangeetInvited: row.sangeet_invited !== 0,
    ceremonyInvited: row.ceremony_invited !== 0,
    receptionInvited: row.reception_invited !== 0,
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

function publicGuestRow(guest) {
  return {
    id: guest.id,
    name: guest.name,
    isPrimary: guest.isPrimary,
    isPartner: guest.isPartner,
    isAdditional: guest.isAdditional,
    primaryGuestId: guest.primaryGuestId,
    childrenAllowed: guest.childrenAllowed,
    maxChildren: guest.maxChildren,
    childrenCount: 0,
    ceremonyChildrenCount: 0,
    receptionChildrenCount: 0,
    sangeetAttending: null,
    ceremonyAttending: null,
    receptionAttending: null,
    sangeetInvited: guest.sangeetInvited,
    ceremonyInvited: guest.ceremonyInvited,
    receptionInvited: guest.receptionInvited,
  };
}

function publicRsvpGroup(group) {
  return {
    householdName: group.householdName,
    accessCode: group.accessCode,
    plusOneLimit: group.plusOneLimit,
    guests: group.guests.filter(guest => !guest.isAdditional).map(publicGuestRow),
    rsvp: {
      dietaryRequirements: '',
      message: '',
      submittedAt: null,
    },
    rsvpDeadline: group.rsvpDeadline,
  };
}

function submittedRsvpGroup(group) {
  return {
    ...publicRsvpGroup(group),
    guests: group.guests.map(guest => ({
      ...publicGuestRow(guest),
      childrenCount: guest.childrenCount,
      ceremonyChildrenCount: guest.ceremonyChildrenCount,
      receptionChildrenCount: guest.receptionChildrenCount,
      sangeetAttending: guest.sangeetAttending,
      ceremonyAttending: guest.ceremonyAttending,
      receptionAttending: guest.receptionAttending,
    })),
    rsvp: {
      dietaryRequirements: group.rsvp.dietaryRequirements,
      message: group.rsvp.message,
      submittedAt: group.rsvp.submittedAt,
    },
  };
}

function groupSummary(group) {
  const guests = group.guests || [];
  const allAnswered = guests.length > 0 && guests.every(guest =>
    (guest.sangeetInvited === false || guest.sangeetAttending !== null) &&
    (guest.ceremonyInvited === false || guest.ceremonyAttending !== null) &&
    (guest.receptionInvited === false || guest.receptionAttending !== null)
  );
  const someAnswered = guests.some(guest =>
    guest.sangeetAttending !== null || guest.ceremonyAttending !== null || guest.receptionAttending !== null
  );
  return {
    status: !guests.length ? 'empty' : allAnswered ? 'complete' : someAnswered ? 'partial' : 'pending',
    sangeetYes: guests.filter(guest => guest.sangeetAttending === true).length,
    ceremonyYes: guests.filter(guest => guest.ceremonyAttending === true).length,
    receptionYes: guests.filter(guest => guest.receptionAttending === true).length,
    sangeetNo: guests.filter(guest => guest.sangeetAttending === false).length,
    ceremonyNo: guests.filter(guest => guest.ceremonyAttending === false).length,
    receptionNo: guests.filter(guest => guest.receptionAttending === false).length,
    children: guests.reduce((total, guest) => total + Number(guest.childrenCount || 0), 0),
  };
}

function inviteAdminHtml(request, env) {
  const inviteBaseUrl = env.INVITE_BASE_URL || new URL(request.url).origin;
  return html(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Wedding Invite List</title>
  <style>
    :root { color-scheme: light; --ink:#2f2926; --muted:#7b7068; --line:#d8c3a5; --cream:#faf7ef; --burgundy:#7b2434; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: var(--cream); color: var(--ink); }
    header { padding: 32px clamp(18px, 4vw, 48px); border-bottom: 1px solid var(--line); background: #fff; }
    h1 { margin: 0; font-family: Georgia, serif; font-size: clamp(32px, 5vw, 56px); font-weight: 400; }
    main { width: min(1180px, calc(100% - 32px)); margin: 28px auto 48px; }
    form, .toolbar, table { background: #fff; border: 1px solid var(--line); }
    form { display: grid; gap: 14px; max-width: 460px; padding: 22px; }
    label { display: grid; gap: 6px; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--muted); }
    input { width: 100%; border: 1px solid var(--line); padding: 12px; font: inherit; }
    button { border: 1px solid var(--line); background: #fff; color: var(--ink); padding: 11px 14px; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; cursor: pointer; }
    button.primary { background: var(--burgundy); border-color: var(--burgundy); color: #fff; }
    button:disabled { opacity: .55; cursor: not-allowed; }
    .toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; padding: 14px; }
    .toolbar input { max-width: 360px; }
    .meta { color: var(--muted); font-size: 13px; }
    .error { color: var(--burgundy); }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; min-width: 860px; border-collapse: collapse; }
    th, td { padding: 14px; border-bottom: 1px solid #eadfce; text-align: left; vertical-align: top; }
    th { color: var(--muted); font-size: 11px; letter-spacing: .18em; text-transform: uppercase; background: #fffaf0; }
    td { font-size: 14px; line-height: 1.45; }
    .household { font-family: Georgia, serif; font-size: 22px; }
    .link { max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--muted); }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; }
    .hidden { display: none; }
  </style>
</head>
<body>
  <header>
    <h1>Wedding Invite List</h1>
    <p class="meta">Household list and invited family members.</p>
  </header>
  <main>
    <form id="loginForm">
      <label>Username <input id="username" autocomplete="username" placeholder="admin"></label>
      <label>Password <input id="password" type="password" autocomplete="current-password" required></label>
      <button class="primary" type="submit">Open Invite List</button>
      <p id="loginError" class="error"></p>
    </form>
    <section id="app" class="hidden">
      <div class="toolbar">
        <input id="search" placeholder="Search households or family members">
        <div class="meta"><span id="count">0</span> households</div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr id="tableHead"></tr>
          </thead>
          <tbody id="rows"></tbody>
        </table>
      </div>
    </section>
  </main>
  <script>
    const inviteBaseUrl = ${JSON.stringify(inviteBaseUrl)};
    let groups = [];
    const tokenKey = 'invite_admin_token';
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const app = document.getElementById('app');
    const rows = document.getElementById('rows');
    const search = document.getElementById('search');
    const count = document.getElementById('count');
    const tableHead = document.getElementById('tableHead');

    function inviteLink(group) {
      return inviteBaseUrl + '/rsvp/' + encodeURIComponent(group.accessCode);
    }

    function inviteMessage(group) {
      return 'Hi ' + group.householdName + ',\\n\\nWe\\'d love to invite you to our wedding. Please click the link below to RSVP:\\n\\n' + inviteLink(group) + '\\n\\nWith love,\\nRumman & Esther';
    }

    function render() {
      const query = search.value.trim().toLowerCase();
      const filtered = groups.filter(group => {
        const guests = group.guests.map(guest => guest.name).join(' ');
        return (group.householdName + ' ' + guests).toLowerCase().includes(query);
      });
      count.textContent = filtered.length;
      const canCopyInvites = filtered.some(group => Boolean(group.accessCode));
      tableHead.innerHTML = '<th>Household</th><th>Family Members</th>' + (canCopyInvites ? '<th>Invite Link</th><th>Copy</th>' : '');
      rows.innerHTML = filtered.map((group, index) => {
        const guests = group.guests.map(guest => guest.name).join(', ');
        if (!canCopyInvites) return '<tr><td><div class="household">' + escapeHtml(group.householdName) + '</div></td><td>' + escapeHtml(guests) + '</td></tr>';
        const link = inviteLink(group);
        return '<tr><td><div class="household">' + escapeHtml(group.householdName) + '</div></td><td>' + escapeHtml(guests) + '</td><td><div class="link">' + escapeHtml(link) + '</div></td><td><div class="actions"><button data-copy-message="' + index + '">Copy Invite</button><button data-copy-link="' + index + '">Copy Link</button></div></td></tr>';
      }).join('');
      rows.querySelectorAll('[data-copy-message]').forEach(button => {
        button.addEventListener('click', () => navigator.clipboard.writeText(inviteMessage(filtered[Number(button.dataset.copyMessage)])));
      });
      rows.querySelectorAll('[data-copy-link]').forEach(button => {
        button.addEventListener('click', () => navigator.clipboard.writeText(inviteLink(filtered[Number(button.dataset.copyLink)])));
      });
    }

    function escapeHtml(value) {
      return String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
    }

    async function loadGroups(token) {
      const res = await fetch('/api/admin/groups', { headers: { authorization: 'Bearer ' + token } });
      if (!res.ok) throw new Error('Could not load invite list.');
      groups = (await res.json()).groups || [];
      loginForm.classList.add('hidden');
      app.classList.remove('hidden');
      render();
    }

    loginForm.addEventListener('submit', async event => {
      event.preventDefault();
      loginError.textContent = '';
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username: usernameInput.value, password: passwordInput.value }),
      });
      const data = await res.json();
      if (!res.ok) {
        loginError.textContent = data.error || 'Login failed.';
        return;
      }
      sessionStorage.setItem(tokenKey, data.token);
      await loadGroups(data.token);
    });

    search.addEventListener('input', render);
    const existingToken = sessionStorage.getItem(tokenKey);
    if (existingToken) loadGroups(existingToken).catch(() => sessionStorage.removeItem(tokenKey));
  </script>
</body>
</html>`);
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function namedUserSessionKey(username, role, passwordHash) {
  return sha256Hex(`${String(username || '').toLowerCase()}:${role}:${passwordHash}`);
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

async function createToken(env, user = { username: 'admin', role: 'admin' }) {
  const payload = {
    username: user.username,
    role: user.role,
    sessionKey: user.sessionKey || null,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
  };
  const encoded = base64UrlEncode(payload);
  const signature = await sign(encoded, env.SESSION_SECRET);
  return `${encoded}.${signature}`;
}

async function getSession(request, env) {
  const header = request.headers.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature || !env.SESSION_SECRET) return null;
  const expected = await sign(encoded, env.SESSION_SECRET);
  if (signature !== expected) return null;
  try {
    const payload = base64UrlDecode(encoded);
    if (!['admin', 'readonly'].includes(payload.role)) return null;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return null;
    if (!await namedSessionIsActive(payload, env)) return null;
    return payload;
  } catch {
    return null;
  }
}

function parseAdminUsers(env) {
  try {
    const parsed = JSON.parse(env.ADMIN_USERS || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function findNamedUser(username, env) {
  const normalizedUsername = normalizeName(username).toLowerCase();
  const users = parseAdminUsers(env);
  const configuredUser = users.find(user =>
    String(user.username || '').toLowerCase() === normalizedUsername
  );
  if (configuredUser) return configuredUser;
  if (normalizedUsername !== 'roshan') return null;
  const suja = users.find(user => String(user.username || '').toLowerCase() === 'suja');
  return suja?.passwordHash
    ? { username: 'roshan', role: 'readonly', passwordHash: suja.passwordHash }
    : null;
}

async function namedSessionIsActive(payload, env) {
  if (!payload.username || payload.username === 'admin') return payload.role === 'admin';
  const user = findNamedUser(payload.username, env);
  if (!user?.passwordHash) return false;
  const role = user.role === 'admin' ? 'admin' : 'readonly';
  if (role !== payload.role) return false;
  return payload.sessionKey === await namedUserSessionKey(user.username, role, user.passwordHash);
}

async function validateNamedUser(username, password, env) {
  const normalizedUsername = normalizeName(username).toLowerCase();
  if (normalizedUsername === 'admin') return null;
  if (!normalizedUsername || !password) return null;
  const user = findNamedUser(normalizedUsername, env);
  const valid = user?.passwordHash && await sha256Hex(password) === user.passwordHash;
  if (!valid) return null;
  const role = user.role === 'admin' ? 'admin' : 'readonly';
  return {
    username: user.username,
    role,
    sessionKey: await namedUserSessionKey(user.username, role, user.passwordHash),
  };
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
  return json(group.rsvp.submittedAt ? submittedRsvpGroup(group) : publicRsvpGroup(group));
}

async function handleRsvpPost(request, env, accessCode) {
  const body = await readJson(request);
  if (!body || !Array.isArray(body.guests)) return json({ error: 'Invalid RSVP payload.' }, 400);

  const group = await env.DB.prepare('SELECT * FROM guest_groups WHERE access_code = ?').bind(accessCode).first();
  if (!group) return json({ error: 'RSVP link not found.' }, 404);

  const currentGuests = await env.DB.prepare('SELECT * FROM guests WHERE group_id = ?').bind(group.id).all();
  const currentById = new Map((currentGuests.results || []).map(guest => [guest.id, guest]));
  const existingAdditionalGuests = body.guests
    .map(submitted => ({ submitted, current: currentById.get(submitted.id) }))
    .filter(({ current }) => current?.is_additional === 1)
    .map(({ submitted, current }) => ({
      name: current.name,
      sangeetAttending: submitted.sangeetAttending,
      ceremonyAttending: submitted.ceremonyAttending,
      receptionAttending: Object.hasOwn(submitted, 'receptionAttending')
        ? submitted.receptionAttending
        : submitted.ceremonyAttending,
      sangeetInvited: current.sangeet_invited !== 0,
      ceremonyInvited: current.ceremony_invited !== 0,
      receptionInvited: current.reception_invited !== 0,
    }));
  const newAdditionalGuests = Array.isArray(body.additionalGuests)
    ? body.additionalGuests.map(item => typeof item === 'string'
      ? { name: normalizeName(item), sangeetAttending: true, ceremonyAttending: true, receptionAttending: true, sangeetInvited: true, ceremonyInvited: true, receptionInvited: true }
      : {
          ...item,
          name: normalizeName(item?.name),
          sangeetInvited: item?.sangeetInvited !== false,
          ceremonyInvited: item?.ceremonyInvited !== false,
          receptionInvited: item?.receptionInvited !== false,
        }).filter(item => item.name).slice(0, 10)
    : [];
  const additionalGuests = [...existingAdditionalGuests, ...newAdditionalGuests];
  const additionalLimit = Math.max(0, Number(group.plus_one_limit || 0));
  if (additionalGuests.length > additionalLimit) {
    return json({ error: `Only ${additionalLimit} additional guest${additionalLimit === 1 ? '' : 's'} can be added.` }, 400);
  }

  const statements = [];
  for (const submitted of body.guests) {
    const guest = currentById.get(submitted.id);
    if (!guest || guest.is_additional === 1) continue;
    const receptionAttending = Object.hasOwn(submitted, 'receptionAttending')
      ? submitted.receptionAttending
      : submitted.ceremonyAttending;
    const ceremonyChildrenCount = guest.children_allowed === 1 && submitted.ceremonyAttending === true
      ? Math.max(0, Math.min(Number(submitted.ceremonyChildrenCount ?? submitted.childrenCount ?? 0), guest.max_children || 0))
      : 0;
    const receptionChildrenCount = guest.children_allowed === 1 && receptionAttending === true
      ? Math.max(0, Math.min(Number(submitted.receptionChildrenCount ?? submitted.childrenCount ?? 0), guest.max_children || 0))
      : 0;
    statements.push(env.DB.prepare(`
      UPDATE guests
      SET sangeet_attending = ?, ceremony_attending = ?, reception_attending = ?,
          children_count = ?, ceremony_children_count = ?, reception_children_count = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND group_id = ?
    `).bind(
      boolToDb(submitted.sangeetAttending),
      boolToDb(submitted.ceremonyAttending),
      boolToDb(receptionAttending),
      Math.max(ceremonyChildrenCount, receptionChildrenCount),
      ceremonyChildrenCount,
      receptionChildrenCount,
      guest.id,
      group.id,
    ));
  }

  statements.push(env.DB.prepare('DELETE FROM guests WHERE group_id = ? AND is_additional = 1').bind(group.id));

  additionalGuests.forEach((additionalGuest, index) => {
    statements.push(env.DB.prepare(`
      INSERT INTO guests (
        id, group_id, name, is_primary, is_partner, is_additional,
        children_allowed, max_children, children_count,
        sangeet_attending, ceremony_attending, reception_attending,
        sangeet_invited, ceremony_invited, reception_invited, sort_order
      )
      VALUES (?, ?, ?, 0, 0, 1, 0, 0, 0, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      randomId('gst_'), group.id, additionalGuest.name,
      boolToDb(additionalGuest.sangeetAttending),
      boolToDb(additionalGuest.ceremonyAttending),
      boolToDb(additionalGuest.receptionAttending),
      additionalGuest.sangeetInvited === false ? 0 : 1,
      additionalGuest.ceremonyInvited === false ? 0 : 1,
      additionalGuest.receptionInvited === false ? 0 : 1,
      1000 + index,
    ));
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
  return json({ ok: true, group: submittedRsvpGroup(updated) });
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
  const requestedUsername = normalizeName(body.username).toLowerCase();
  if (requestedUsername && requestedUsername !== 'admin') {
    const user = await validateNamedUser(body.username, body.password, env);
    if (!user) {
      await sleep(400);
      return json({ error: 'Incorrect username or password.' }, 401);
    }
    if (!env.SESSION_SECRET) return json({ error: 'SESSION_SECRET is not configured.' }, 500);
    return json({
      token: await createToken(env, user),
      user: { username: user.username, role: user.role },
    });
  }
  const configuredHash = env.ADMIN_PASSWORD_HASH;
  const configuredPassword = env.ADMIN_PASSWORD;
  const valid = configuredHash
    ? await sha256Hex(body.password) === configuredHash
    : configuredPassword && body.password === configuredPassword;
  if (!valid) {
    await sleep(400);
    return json({ error: 'Incorrect password.' }, 401);
  }
  if (!env.SESSION_SECRET) return json({ error: 'SESSION_SECRET is not configured.' }, 500);
  const user = { username: 'admin', role: 'admin' };
  return json({ token: await createToken(env, user), user });
}

function readOnlyGroup(group) {
  return {
    id: group.id,
    householdName: group.householdName,
    summary: groupSummary(group),
    guests: group.guests.filter(guest => !guest.isAdditional).map(guest => ({
      name: guest.name,
      sangeetAttending: null,
      ceremonyAttending: null,
      receptionAttending: null,
      childrenCount: 0,
    })),
  };
}

async function handleAdminGroupsGet(env, session) {
  const groups = await listGroups(env);
  if (session.role === 'readonly') return json({ groups: groups.map(readOnlyGroup) }, 200, NO_STORE_HEADERS);
  return json({ groups }, 200, NO_STORE_HEADERS);
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
      primary_guest_id, children_allowed, max_children,
      sangeet_invited, ceremony_invited, reception_invited, sort_order
    )
    VALUES (?, ?, ?, ?, ?, 0, NULL, ?, ?, ?, ?, ?, ?)
  `).bind(
    randomId('gst_'),
    groupId,
    normalizeName(guest.name),
    guest.isPartner ? 0 : 1,
    guest.isPartner ? 1 : 0,
    guest.childrenAllowed ? 1 : 0,
    Math.max(0, Number(guest.maxChildren || 0)),
    guest.sangeetInvited === false ? 0 : 1,
    guest.ceremonyInvited === false ? 0 : 1,
    guest.receptionInvited === false ? 0 : 1,
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
        ceremony_children_count, reception_children_count,
        sangeet_attending, ceremony_attending, reception_attending,
        sangeet_invited, ceremony_invited, reception_invited, sort_order
      )
      VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      guest.id || randomId('gst_'),
      groupId,
      name,
      guest.isPartner ? 0 : guest.isAdditional ? 0 : 1,
      guest.isPartner ? 1 : 0,
      guest.isAdditional ? 1 : 0,
      guest.childrenAllowed ? 1 : 0,
      Math.max(0, Number(guest.maxChildren || 0)),
      guest.childrenAllowed ? Math.max(0, Number(guest.childrenCount || 0)) : 0,
      guest.childrenAllowed ? Math.max(0, Number(guest.ceremonyChildrenCount ?? guest.childrenCount ?? 0)) : 0,
      guest.childrenAllowed ? Math.max(0, Number(guest.receptionChildrenCount ?? guest.childrenCount ?? 0)) : 0,
      boolToDb(guest.sangeetAttending),
      boolToDb(guest.ceremonyAttending),
      boolToDb(guest.receptionAttending),
      guest.sangeetInvited === false ? 0 : 1,
      guest.ceremonyInvited === false ? 0 : 1,
      guest.receptionInvited === false ? 0 : 1,
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
      sangeetInvited: idx('sangeet_invited') === -1
        ? true
        : !/^(no|false|0)$/i.test(row[idx('sangeet_invited')] || 'yes'),
      ceremonyInvited: idx('ceremony_invited') === -1
        ? true
        : !/^(no|false|0)$/i.test(row[idx('ceremony_invited')] || 'yes'),
      receptionInvited: idx('reception_invited') === -1
        ? true
        : !/^(no|false|0)$/i.test(row[idx('reception_invited')] || 'yes'),
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
  let string = String(value ?? '');
  const firstVisible = Array.from(string).find(char => char.charCodeAt(0) > 32);
  if (firstVisible && '=+-@'.includes(firstVisible)) string = `'${string}`;
  return /[",\n\r]/.test(string) ? `"${string.replace(/"/g, '""')}"` : string;
}

async function handleAdminExport(env) {
  const groups = await listGroups(env);
  const rows = [[
    'household',
    'guest',
    'seat_type',
    'total_guest_capacity',
    'named_guest_count',
    'additional_guest_spots',
    'submitted_additional_guests',
    'remaining_additional_spots',
    'sangeet_invited',
    'ceremony_invited',
    'reception_invited',
    'sangeet',
    'ceremony',
    'reception',
    'ceremony_children',
    'reception_children',
    'dietary',
    'message',
    'submitted_at',
    'invite_link',
  ]];
  groups.forEach(group => {
    const namedGuestCount = group.guests.filter(guest => !guest.isAdditional).length;
    const additionalGuestSpots = Math.max(0, Number(group.plusOneLimit || 0));
    const submittedAdditionalGuests = group.guests.filter(guest => guest.isAdditional).length;
    const remainingAdditionalSpots = Math.max(0, additionalGuestSpots - submittedAdditionalGuests);
    const totalGuestCapacity = namedGuestCount + additionalGuestSpots;
    group.guests.forEach(guest => {
      rows.push([
        group.householdName,
        guest.name,
        guest.isAdditional ? 'additional_submitted' : 'named',
        totalGuestCapacity,
        namedGuestCount,
        additionalGuestSpots,
        submittedAdditionalGuests,
        remainingAdditionalSpots,
        guest.sangeetInvited ? 'yes' : 'no',
        guest.ceremonyInvited ? 'yes' : 'no',
        guest.receptionInvited ? 'yes' : 'no',
        guest.sangeetAttending === null ? 'pending' : guest.sangeetAttending ? 'yes' : 'no',
        guest.ceremonyAttending === null ? 'pending' : guest.ceremonyAttending ? 'yes' : 'no',
        guest.receptionAttending === null ? 'pending' : guest.receptionAttending ? 'yes' : 'no',
        guest.ceremonyChildrenCount,
        guest.receptionChildrenCount,
        group.rsvp.dietaryRequirements,
        group.rsvp.message,
        group.rsvp.submittedAt || '',
        `/rsvp/${group.accessCode}`,
      ]);
    });
    for (let index = 0; index < remainingAdditionalSpots; index += 1) {
      rows.push([
        group.householdName,
        `Additional guest spot ${index + 1}`,
        'additional_available',
        totalGuestCapacity,
        namedGuestCount,
        additionalGuestSpots,
        submittedAdditionalGuests,
        remainingAdditionalSpots,
        '',
        '',
        '',
        'pending',
        'pending',
        'pending',
        0,
        0,
        group.rsvp.dietaryRequirements,
        group.rsvp.message,
        group.rsvp.submittedAt || '',
        `/rsvp/${group.accessCode}`,
      ]);
    }
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
  if (method === 'GET' && url.pathname === '/admin') return inviteAdminHtml(request, env);
  if (parts[0] !== 'api') return json({ error: 'Not found.' }, 404);

  if (parts[1] === 'health') return json({ ok: true });

  if (parts[1] === 'rsvp' && parts[2]) {
    if (method === 'GET') return handleRsvpGet(request, env, parts[2]);
    if (method === 'POST') return handleRsvpPost(request, env, parts[2]);
  }

  if (parts[1] === 'admin' && parts[2] === 'login' && method === 'POST') return handleAdminLogin(request, env);

  if (parts[1] === 'admin') {
    const session = await getSession(request, env);
    if (!session) return json({ error: 'Admin login required.' }, 401);
    if (parts[2] === 'groups' && method === 'GET') return handleAdminGroupsGet(env, session);
    if (session.role !== 'admin') return json({ error: 'Read-only access cannot change invitees.' }, 403);
    if (parts[2] === 'export' && method === 'GET') return handleAdminExport(env);
    if (parts[2] === 'groups' && method === 'POST') return handleAdminGroupCreate(request, env);
    if (parts[2] === 'groups' && parts[3] && method === 'PATCH') return handleAdminGroupPatch(request, env, parts[3]);
    if (parts[2] === 'groups' && parts[3] && method === 'DELETE') return handleAdminGroupDelete(env, parts[3]);
    if (parts[2] === 'import' && method === 'POST') return handleAdminImport(request, env);
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
