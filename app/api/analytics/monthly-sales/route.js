import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import Order from '@/models/Order'

export async function GET() {
  await connectDB()
  const guard = requireAuth('admin')
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status })
  const data = await Order.aggregate([
    { $group: {
      _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
      orders: { $sum: 1 },
      revenue: { $sum: '$total' }
    }},
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ])
  return NextResponse.json(data)
}
