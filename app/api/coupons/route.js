import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Coupon from '@/models/Coupon'
import { requireAuth } from '@/lib/auth'
import { couponSchema } from '@/lib/validators'

export async function GET(req) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const code = (searchParams.get('code') || '').toUpperCase()
  if (code) {
    const now = new Date()
    const c = await Coupon.findOne({ code })
    const valid = !!(c && c.active && (!c.expiresAt || c.expiresAt > now))
    return NextResponse.json({ valid, coupon: valid ? c : null })
  }
  const guard = requireAuth('admin')
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status })
  const items = await Coupon.find({}).sort({ createdAt: -1 })
  return NextResponse.json(items)
}

export async function POST(req) {
  await connectDB()
  const guard = requireAuth('admin')
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status })
  const body = await req.json()
  const { value, error } = couponSchema.validate(body)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  const c = await Coupon.create(value)
  return NextResponse.json(c, { status: 201 })
}
