import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Category from '@/models/Category'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  await connectDB()
  const items = await Category.find({}).sort({ name: 1 })
  return NextResponse.json(items)
}

export async function POST(req) {
  await connectDB()
  const guard = requireAuth('admin')
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status })
  const body = await req.json()
  if (!body?.name || !body?.slug) return NextResponse.json({ error: 'name and slug required' }, { status: 400 })
  const c = await Category.create({ name: body.name, slug: body.slug })
  return NextResponse.json(c, { status: 201 })
}
