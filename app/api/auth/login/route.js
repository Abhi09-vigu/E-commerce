import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { loginSchema } from '@/lib/validators'
import { signToken } from '@/lib/auth'

export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()
    const { value, error } = loginSchema.validate(body)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    const user = await User.findOne({ email: value.email })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    const ok = await user.comparePassword(value.password)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role })
    const res = NextResponse.json({ id: user._id, email: user.email, role: user.role })
    res.cookies.set('token', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 7 * 24 * 3600 })
    return res
  } catch (e) {
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
  }
}
