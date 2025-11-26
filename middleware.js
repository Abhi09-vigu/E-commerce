import { NextResponse } from 'next/server'

function parseJwt(token) {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    let payload = parts[1]
    payload = payload.replace(/-/g, '+').replace(/_/g, '/')
    while (payload.length % 4) payload += '='
    const json = atob(payload)
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

export function middleware(req) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = req.cookies.get('token')?.value
    const decoded = parseJwt(token)
    if (!decoded || decoded.role !== 'admin') {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
