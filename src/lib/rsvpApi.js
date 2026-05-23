const PRODUCTION_API_BASE_URL = 'https://rummanandesther-rsvp.rumman-formaai.workers.dev'
const LOCAL_API_BASE_URL = 'http://localhost:8787'

function defaultApiBaseUrl() {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return LOCAL_API_BASE_URL
  }
  if (typeof window !== 'undefined' && window.location.hostname === '127.0.0.1') {
    return LOCAL_API_BASE_URL
  }
  return PRODUCTION_API_BASE_URL
}

export const RSVP_API_BASE_URL =
  import.meta.env.VITE_RSVP_API_BASE_URL || defaultApiBaseUrl()

const ADMIN_TOKEN_KEY = 'rsvp_admin_token'

async function parseResponse(res) {
  const contentType = res.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await res.json() : await res.text()
  if (!res.ok) {
    const message = typeof body === 'object' && body?.error ? body.error : 'Something went wrong.'
    throw new Error(message)
  }
  return body
}

async function request(path, options = {}) {
  const headers = {
    'content-type': 'application/json',
    ...(options.headers || {}),
  }
  return parseResponse(await fetch(`${RSVP_API_BASE_URL}${path}`, {
    ...options,
    headers,
  }))
}

function adminHeaders() {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY)
  return token ? { authorization: `Bearer ${token}` } : {}
}

export function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY)
}

export function clearAdminToken() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
}

export async function fetchRsvp(accessCode) {
  return request(`/api/rsvp/${encodeURIComponent(accessCode)}`)
}

export async function submitRsvp(accessCode, payload) {
  return request(`/api/rsvp/${encodeURIComponent(accessCode)}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function adminLogin(password) {
  const data = await request('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
  sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token)
  return data
}

export async function fetchAdminGroups() {
  return request('/api/admin/groups', { headers: adminHeaders() })
}

export async function createAdminGroup(payload) {
  return request('/api/admin/groups', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  })
}

export async function updateAdminGroup(groupId, payload) {
  return request(`/api/admin/groups/${groupId}`, {
    method: 'PATCH',
    headers: adminHeaders(),
    body: JSON.stringify(payload),
  })
}

export async function deleteAdminGroup(groupId) {
  return request(`/api/admin/groups/${groupId}`, {
    method: 'DELETE',
    headers: adminHeaders(),
  })
}

export async function importAdminCsv(csv) {
  return request('/api/admin/import', {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({ csv }),
  })
}

export async function exportAdminCsv() {
  const res = await fetch(`${RSVP_API_BASE_URL}/api/admin/export`, {
    headers: adminHeaders(),
  })
  return parseResponse(res)
}

export function buildInviteLink(accessCode) {
  return `${window.location.origin}/rsvp/${accessCode}`
}
