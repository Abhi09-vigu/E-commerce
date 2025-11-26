import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import { productSchema } from '@/lib/validators'
import { requireAuth } from '@/lib/auth'

export async function GET(req) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '12', 10)
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || 'createdAt:desc'

  const [sortField, sortDir] = sort.split(':')
  const sortObj = { [sortField]: sortDir === 'asc' ? 1 : -1 }

  const filter = { }
  if (q) filter.title = { $regex: q, $options: 'i' }
  if (category) filter.category = category
  filter.active = true

  const total = await Product.countDocuments(filter)
  const items = await Product.find(filter).sort(sortObj).skip((page - 1) * limit).limit(limit)
  return NextResponse.json({ items, page, limit, total })
}

export async function POST(req) {
  await connectDB()
  const guard = requireAuth('admin')
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status })
  const body = await req.json()
  const { value, error } = productSchema.validate(body)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  const p = await Product.create(value)
  return NextResponse.json(p, { status: 201 })
}
