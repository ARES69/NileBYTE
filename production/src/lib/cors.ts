import { NextResponse } from 'next/server'

/**
 * CORS for public demo-facing routes (concept site on :8000 / file:// calls the API on :3000).
 * Only non-auth endpoints use this; staff routes stay same-origin/cookie.
 */
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
}

export function preflight() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export function jres(body: unknown, status = 200) {
  const r = NextResponse.json(body, { status })
  Object.entries(CORS_HEADERS).forEach(([k, v]) => r.headers.set(k, v))
  return r
}
