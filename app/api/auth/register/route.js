import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { registerSchema } from '@/lib/validators'

export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()
    const { value, error } = registerSchema.validate(body)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    const exists = await User.findOne({ email: value.email })
    if (exists) return NextResponse.json({ error: 'Email already in use' }, { status: 409 })

    const isFirstUser = (await User.countDocuments()) === 0
    const user = await User.create({ ...value, role: isFirstUser ? 'admin' : 'user' })
    return NextResponse.json({ id: user._id, email: user.email, role: user.role })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 })
  }
}
