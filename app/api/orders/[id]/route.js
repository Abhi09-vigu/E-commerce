import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import Order from '@/models/Order'

export async function GET(_, { params }) {
  await connectDB()
  const guard = requireAuth()
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status })
  const order = await Order.findById(params.id).lean()
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const isOwner = order.user?.toString?.() === guard.user.id
  const isAdmin = guard.user.role === 'admin'
  if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return NextResponse.json(order)
}
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Order from '@/models/Order'
import { requireAuth } from '@/lib/auth'

export async function GET(_, { params }) {
  await connectDB()
  const guard = requireAuth()
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status })
  const o = await Order.findById(params.id).populate('user', 'name email')
  if (!o) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (guard.user.role !== 'admin' && o.user._id.toString() !== guard.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return NextResponse.json(o)
}
