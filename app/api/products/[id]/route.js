import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import { productSchema } from '@/lib/validators'
import { requireAuth } from '@/lib/auth'

export async function GET(_, { params }) {
  await connectDB()
  const p = await Product.findById(params.id)
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(p)
}

export async function PUT(req, { params }) {
  await connectDB()
  const guard = requireAuth('admin')
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status })
  const body = await req.json()
  const { value, error } = productSchema.fork(['title','price','stock'], schema => schema.optional()).validate(body)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  const p = await Product.findByIdAndUpdate(params.id, value, { new: true })
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(p)
}

export async function DELETE(_, { params }) {
  await connectDB()
  const guard = requireAuth('admin')
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status })
  const p = await Product.findByIdAndDelete(params.id)
  if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
