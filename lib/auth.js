import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

export function signToken(payload, options = {}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d', ...options })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (e) {
    return null
  }
}

export function getAuthUser() {
  const c = cookies()
  const token = c.get('token')?.value
  if (!token) return null
  const decoded = verifyToken(token)
  return decoded
}

export function requireAuth(role = null) {
  const user = getAuthUser()
  if (!user) return { ok: false, status: 401, message: 'Unauthorized' }
  if (role && user.role !== role) return { ok: false, status: 403, message: 'Forbidden' }
  return { ok: true, user }
}
