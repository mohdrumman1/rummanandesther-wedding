import { AwsClient, AwsV4Signer } from 'aws4fetch';

const MAX_FILE_BYTES = 4 * 1024 * 1024 * 1024;
const MAX_DEVICE_FILES = 2000;
const MAX_DEVICE_BYTES = 40 * 1024 * 1024 * 1024;
const MAX_THUMB_BYTES = 200 * 1024;
const MAX_THUMB_B64 = 280000;
const MAX_TOTAL_FILES = 20000;
const MAX_TOTAL_BYTES = 200 * 1024 * 1024 * 1024;
const URL_TTL = 3600;
const BUCKET = 'wedding-media';
const PAGE_SIZE = 60;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PENDING_GRACE_MS = 60 * 60 * 1000; // pending rows count toward caps only this long
const STALE_PENDING_MS = 24 * 60 * 60 * 1000; // cron removes pending rows older than this
const CLEANUP_BATCH = 200;
const CLEANUP_ROUNDS = 3;
// Explicit allowlist: anything else (svg, html, octet-stream...) is rejected with 415.
const TYPE_EXT = {
  'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/heic': 'heic', 'image/heif': 'heif',
  'image/heic-sequence': 'heic', 'image/heif-sequence': 'heif', 'image/webp': 'webp', 'image/gif': 'gif',
  'image/avif': 'avif', 'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm', 'video/3gpp': '3gp',
  'video/3gpp2': '3g2', 'video/x-m4v': 'm4v', 'video/mpeg': 'mpg', 'video/x-msvideo': 'avi', 'video/x-matroska': 'mkv',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

function fail(message, status = 400) {
  return json({ error: message }, status);
}

function safeEqual(a, b) {
  const enc = new TextEncoder();
  const x = enc.encode(String(a));
  const y = enc.encode(String(b));
  let diff = x.length ^ y.length;
  const len = Math.max(x.length, y.length);
  for (let i = 0; i < len; i += 1) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

function sanitizeFilename(name) {
  const cleaned = String(name || '').split(/[\\/]/).pop().replace(/[^\w.\- ()]/g, '_').replace(/\.{2,}/g, '.').trim().slice(0, 120);
  return cleaned || 'upload';
}

function r2Client(env) {
  return new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    service: 's3',
    region: 'auto',
  });
}

function objectUrl(env, key, params = {}) {
  const base = `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET}/${key.split('/').map(encodeURIComponent).join('/')}`;
  const u = new URL(base);
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, String(v)));
  return u;
}

export async function presign(env, method, key, params = {}, headers = {}) {
  const u = objectUrl(env, key, { ...params, 'X-Amz-Expires': URL_TTL });
  // Signer used directly (not via Request) so content-length survives and is signed.
  const signer = new AwsV4Signer({
    url: u.toString(), method, headers, signQuery: true, allHeaders: true,
    accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY, service: 's3', region: 'auto',
  });
  return (await signer.sign()).url.toString();
}

function xmlTag(xml, tag) {
  const m = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`).exec(xml);
  return m ? m[1] : null;
}

function xmlBlocks(xml, tag) {
  return [...xml.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g'))].map(m => m[1]);
}

function xmlEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function s3Call(env, method, key, params, body) {
  const res = await r2Client(env).fetch(objectUrl(env, key, params), { method, body });
  const text = await res.text();
  if (!res.ok || /<Error>/.test(text)) {
    throw new Error(`Storage error: ${xmlTag(text, 'Message') || res.status}`);
  }
  return text;
}

async function checkGate(request, env) {
  if (!env.UPLOAD_CODE || !env.R2_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
    return { res: fail('Uploads are not configured.', 503) };
  }
  const code = request.headers.get('x-upload-code') || '';
  if (!safeEqual(code, env.UPLOAD_CODE)) return { res: fail('Invalid upload code.', 403) };
  const deviceId = request.headers.get('x-device-id') || '';
  if (!UUID_RE.test(deviceId)) return { res: fail('Missing or invalid device id.', 400) };
  if (env.UPLOAD_CLOSES) {
    const closes = Date.parse(env.UPLOAD_CLOSES);
    if (Number.isFinite(closes) && Date.now() > closes) return { res: json({ error: 'Uploads are closed.', closed: true }, 410) };
  }
  // The venue is one NAT IP: per-device limit for fairness, a generous per-IP backstop for floods.
  const ip = request.headers.get('cf-connecting-ip');
  if (!await allowed(env.UPLOAD_IP_LIMITER, ip) || !await allowed(env.UPLOAD_LIMITER, deviceId)) {
    return { res: fail('Too many requests. Please slow down.', 429) };
  }
  const rawName = request.headers.get('x-uploader-name') || '';
  let name;
  try { name = decodeURIComponent(rawName); } catch { name = rawName; }
  // eslint-disable-next-line no-control-regex
  name = name.replace(/[\u0000-\u001f\u007f-\u009f]/g, '').trim().slice(0, 80);
  return { deviceId, uploaderName: name || null };
}

async function allowed(limiter, key) {
  if (!limiter || !key) return true;
  const { success } = await limiter.limit({ key });
  return success;
}

async function validateNewFile(request, env, deviceId) {
  const body = await request.json().catch(() => null);
  if (!body) return { res: fail('Invalid JSON.') };
  const type = String(body.type || '').toLowerCase().split(';')[0].trim();
  const size = Number(body.size);
  if (!Object.hasOwn(TYPE_EXT, type)) return { res: fail('Only photos and videos are allowed.', 415) };
  if (!Number.isFinite(size) || size <= 0 || size > MAX_FILE_BYTES) return { res: fail('File size not allowed (max 4GB).', 413) };
  // Abandoned pending rows stop counting after an hour (and the cron deletes them after a day).
  const live = "(status = 'complete' OR created_at > ?)";
  const since = new Date(Date.now() - PENDING_GRACE_MS).toISOString();
  const usage = await env.DB.prepare(`SELECT COUNT(*) AS n, COALESCE(SUM(size),0) AS bytes FROM media WHERE device_id = ? AND ${live}`).bind(deviceId, since).first();
  if (usage.n >= MAX_DEVICE_FILES || usage.bytes + size > MAX_DEVICE_BYTES) return { res: fail('Upload limit reached for this device.', 413) };
  const total = await env.DB.prepare(`SELECT COUNT(*) AS n, COALESCE(SUM(size),0) AS bytes FROM media WHERE ${live}`).bind(since).first();
  if (total.n >= MAX_TOTAL_FILES || total.bytes + size > MAX_TOTAL_BYTES) return { res: fail('The shared album is full.', 413) };
  const filename = sanitizeFilename(body.filename);
  const id = crypto.randomUUID();
  // Key carries no device id; ownership lives in the DB row.
  const key = `orig/${crypto.randomUUID()}/${crypto.randomUUID()}.${TYPE_EXT[type]}`;
  return { id, key, type, size: Math.floor(size), filename };
}

async function insertRow(env, row, deviceId, uploaderName, uploadId) {
  await env.DB.prepare(
    `INSERT INTO media (id, device_id, uploader_name, key, filename, content_type, size, upload_id, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
  ).bind(row.id, deviceId, uploaderName, row.key, row.filename, row.type, row.size, uploadId, new Date().toISOString()).run();
}

// The key must match this device's DB row for this multipart upload (works for old and new key layouts).
async function ownedMultipart(env, deviceId, uploadId, key) {
  if (!key || !uploadId) return null;
  return env.DB.prepare('SELECT * FROM media WHERE key = ? AND device_id = ? AND upload_id = ?').bind(key, deviceId, uploadId).first();
}

async function handleSingle(request, env, g) {
  const f = await validateNewFile(request, env, g.deviceId);
  if (f.res) return f.res;
  await insertRow(env, f, g.deviceId, g.uploaderName, null);
  const url = await presign(env, 'PUT', f.key, {}, { 'content-type': f.type, 'content-length': String(f.size) });
  return json({ id: f.id, key: f.key, url });
}

async function handleMultipartCreate(request, env, g) {
  const f = await validateNewFile(request, env, g.deviceId);
  if (f.res) return f.res;
  const res = await r2Client(env).fetch(objectUrl(env, f.key, { uploads: '' }), { method: 'POST', headers: { 'content-type': f.type } });
  const text = await res.text();
  if (!res.ok || /<Error>/.test(text)) return fail('Could not start upload.', 502);
  const uploadId = xmlTag(text, 'UploadId');
  if (!uploadId) return fail('Could not start upload.', 502);
  await insertRow(env, f, g.deviceId, g.uploaderName, uploadId);
  return json({ id: f.id, key: f.key, uploadId });
}

async function handleMultipartPart(env, g, url, uploadId, partNumber) {
  const key = url.searchParams.get('key');
  const n = Number(partNumber);
  if (!Number.isInteger(n) || n < 1 || n > 10000) return fail('Invalid part number.');
  if (!await ownedMultipart(env, g.deviceId, uploadId, key)) return fail('Upload not found.', 404);
  return json({ url: await presign(env, 'PUT', key, { partNumber: n, uploadId }) });
}

async function handleMultipartList(env, g, url, uploadId) {
  const key = url.searchParams.get('key');
  if (!await ownedMultipart(env, g.deviceId, uploadId, key)) return fail('Upload not found.', 404);
  const parts = [];
  let marker = null;
  for (let page = 0; page < 20; page += 1) {
    const params = { uploadId };
    if (marker) params['part-number-marker'] = marker;
    const xml = await s3Call(env, 'GET', key, params);
    xmlBlocks(xml, 'Part').forEach(block => parts.push({
      PartNumber: Number(xmlTag(block, 'PartNumber')),
      Size: Number(xmlTag(block, 'Size')),
      ETag: (xmlTag(block, 'ETag') || '').replace(/&quot;/g, '"'),
    }));
    if (xmlTag(xml, 'IsTruncated') !== 'true') break;
    marker = xmlTag(xml, 'NextPartNumberMarker');
    if (!marker) break;
  }
  return json({ parts });
}

async function handleMultipartComplete(request, env, g, uploadId) {
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.parts) || !body.parts.length) return fail('Invalid JSON.');
  const row = await ownedMultipart(env, g.deviceId, uploadId, body.key);
  if (!row) return fail('Upload not found.', 404);
  const parts = body.parts
    .map(p => ({ n: Number(p.PartNumber), etag: String(p.ETag || '') }))
    .filter(p => Number.isInteger(p.n) && p.n >= 1 && p.etag)
    .sort((a, b) => a.n - b.n);
  if (parts.length !== body.parts.length) return fail('Invalid parts.');
  const xml = `<CompleteMultipartUpload>${parts.map(p => `<Part><PartNumber>${p.n}</PartNumber><ETag>${xmlEscape(p.etag)}</ETag></Part>`).join('')}</CompleteMultipartUpload>`;
  await s3Call(env, 'POST', body.key, { uploadId }, xml);
  const head = await env.MEDIA.head(body.key);
  if (head && !sizeOk(head.size, row.size)) {
    await rejectObject(env, row);
    return fail('File size not allowed.', 413);
  }
  return json({ location: body.key });
}

async function handleMultipartAbort(env, g, url, uploadId) {
  const key = url.searchParams.get('key');
  const row = await ownedMultipart(env, g.deviceId, uploadId, key);
  if (!row) return fail('Upload not found.', 404);
  await s3Call(env, 'DELETE', key, { uploadId }).catch(() => null);
  await env.DB.prepare("DELETE FROM media WHERE id = ? AND status = 'pending'").bind(row.id).run();
  return json({ ok: true });
}

// Real stored size must be positive, within the declared size and the 4GB cap.
function sizeOk(actual, declared) {
  return actual > 0 && actual <= declared && actual <= MAX_FILE_BYTES;
}

// Oversized/invalid object: remove it from storage and drop the row (status only allows pending/complete).
async function rejectObject(env, row) {
  await env.MEDIA.delete(row.key);
  await env.DB.prepare('DELETE FROM media WHERE id = ?').bind(row.id).run();
}

function decodeBase64(b64) {
  const clean = String(b64).replace(/^data:[^,]*,/, '');
  const bin = atob(clean);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function handleDone(request, env, g, id) {
  const row = await env.DB.prepare('SELECT * FROM media WHERE id = ? AND device_id = ?').bind(id, g.deviceId).first();
  if (!row) return fail('Upload not found.', 404);
  const head = await env.MEDIA.head(row.key);
  if (!head) return fail('File not found in storage.', 409);
  if (!sizeOk(head.size, row.size)) {
    await rejectObject(env, row);
    return fail('File size not allowed.', 413);
  }
  const body = await request.json().catch(() => ({})) || {};
  let thumbKey = null;
  if (body.thumbBase64) {
    if (String(body.thumbBase64).length > MAX_THUMB_B64) return fail('Thumbnail too large.', 413);
    let bytes;
    try { bytes = decodeBase64(body.thumbBase64); } catch { return fail('Invalid thumbnail.'); }
    if (bytes.length > MAX_THUMB_BYTES) return fail('Thumbnail too large.', 413);
    if (bytes.length < 3 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) return fail('Thumbnail must be JPEG.', 415);
    thumbKey = `thumb/${id}.jpg`;
    await env.MEDIA.put(thumbKey, bytes, { httpMetadata: { contentType: 'image/jpeg' } });
  }
  await env.DB.prepare("UPDATE media SET status = 'complete', size = ?, thumb_key = COALESCE(?, thumb_key) WHERE id = ?")
    .bind(head.size, thumbKey, id).run();
  return json({ ok: true });
}

export async function handleUploads(request, env, url) {
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts[0] !== 'api' || parts[1] !== 'uploads') return null;
  const method = request.method;
  const g = await checkGate(request, env);
  if (g.res) return g.res;
  const [, , a, b, c] = parts;

  if (a === 'single' && !b && method === 'POST') return handleSingle(request, env, g);
  if (a === 'multipart') {
    if (!b && method === 'POST') return handleMultipartCreate(request, env, g);
    if (b && c === 'complete' && method === 'POST') return handleMultipartComplete(request, env, g, b);
    if (b && c && c !== 'complete' && method === 'GET') return handleMultipartPart(env, g, url, b, c);
    if (b && !c && method === 'GET') return handleMultipartList(env, g, url, b);
    if (b && !c && method === 'DELETE') return handleMultipartAbort(env, g, url, b);
  }
  if (a && b === 'done' && !c && a !== 'single' && a !== 'multipart' && method === 'POST') return handleDone(request, env, g, a);
  return fail('Not found.', 404);
}

async function listMedia(env, url, guestDeviceId) {
  const guest = Boolean(guestDeviceId);
  const cursor = url.searchParams.get('cursor') || '';
  const uploader = guest ? '' : (url.searchParams.get('uploader') || '').trim();
  const where = ["status = 'complete'"];
  const binds = [];
  if (guest) { where.push('device_id = ?'); binds.push(guestDeviceId); }
  if (uploader) { where.push('uploader_name = ?'); binds.push(uploader); }
  if (cursor) {
    const [ts, cid] = cursor.split('|');
    where.push('(created_at < ? OR (created_at = ? AND id < ?))');
    binds.push(ts, ts, cid || '');
  }
  const { results } = await env.DB.prepare(
    `SELECT * FROM media WHERE ${where.join(' AND ')} ORDER BY created_at DESC, id DESC LIMIT ${PAGE_SIZE + 1}`,
  ).bind(...binds).all();
  const page = results.slice(0, PAGE_SIZE);
  const items = await Promise.all(page.map(async row => ({
    id: row.id,
    uploader_name: row.uploader_name,
    ...(guest ? {} : { device_id: row.device_id }),
    filename: row.filename,
    content_type: row.content_type,
    size: row.size,
    created_at: row.created_at,
    thumbUrl: row.thumb_key ? await presign(env, 'GET', row.thumb_key) : null,
    originalUrl: await presign(env, 'GET', row.key, {
      'response-content-disposition': `attachment; filename="${row.filename.replace(/"/g, '')}"`,
    }),
    ...(guest ? { inlineUrl: await presign(env, 'GET', row.key, { 'response-content-type': row.content_type }) } : {}),
  })));
  const last = page[page.length - 1];
  return json({ items, nextCursor: results.length > PAGE_SIZE && last ? `${last.created_at}|${last.id}` : null });
}

export const handleAdminMediaList = (request, env, url) => listMedia(env, url, null);

// Guest "my uploads": needs upload code AND device id; SQL is hard-filtered to that device_id.
export async function handleGuestGallery(request, env, url) {
  if (!env.UPLOAD_CODE || !env.R2_ACCOUNT_ID || !env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
    return fail('Gallery is not configured.', 503);
  }
  if (!safeEqual(request.headers.get('x-upload-code') || '', env.UPLOAD_CODE)) return fail('Invalid upload code.', 403);
  const deviceId = request.headers.get('x-device-id') || '';
  if (!UUID_RE.test(deviceId)) return fail('Missing or invalid device id.', 400);
  // Own limiter so browsing the gallery never spends upload budget.
  if (!await allowed(env.GALLERY_LIMITER, deviceId)) return fail('Too many requests. Please slow down.', 429);
  return listMedia(env, url, deviceId);
}

export async function handleAdminMediaDelete(env, id) {
  const row = await env.DB.prepare('SELECT * FROM media WHERE id = ?').bind(id).first();
  if (!row) return fail('Not found.', 404);
  if (row.upload_id && row.status === 'pending') await s3Call(env, 'DELETE', row.key, { uploadId: row.upload_id }).catch(() => null);
  await env.MEDIA.delete([row.key, ...(row.thumb_key ? [row.thumb_key] : [])]);
  await env.DB.prepare('DELETE FROM media WHERE id = ?').bind(id).run();
  return json({ ok: true });
}

// Cron: drop pending rows older than a day, aborting any multipart upload and deleting any stored object.
export async function cleanupStalePending(env) {
  const cutoff = new Date(Date.now() - STALE_PENDING_MS).toISOString();
  const canSign = env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY;
  let removed = 0;
  for (let round = 0; round < CLEANUP_ROUNDS; round += 1) {
    const { results } = await env.DB.prepare(
      `SELECT id, key, upload_id, thumb_key FROM media WHERE status = 'pending' AND created_at < ? ORDER BY created_at LIMIT ${CLEANUP_BATCH}`,
    ).bind(cutoff).all();
    if (!results.length) break;
    if (canSign) {
      await Promise.all(results.filter(r => r.upload_id)
        .map(r => s3Call(env, 'DELETE', r.key, { uploadId: r.upload_id }).catch(() => null)));
    }
    await env.MEDIA.delete(results.flatMap(r => [r.key, ...(r.thumb_key ? [r.thumb_key] : [])]));
    await env.DB.batch(results.map(r => env.DB.prepare("DELETE FROM media WHERE id = ? AND status = 'pending'").bind(r.id)));
    removed += results.length;
    if (results.length < CLEANUP_BATCH) break;
  }
  return removed;
}
