import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import Cart from '@/models/Cart'
import Product from '@/models/Product'
import { cartItemSchema } from '@/lib/validators'

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId })
  if (!cart) cart = await Cart.create({ user: userId, items: [] })
  return cart
}

export async function GET() {
  await connectDB()
  const guard = requireAuth()
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status })
  const cart = await getOrCreateCart(guard.user.id)
  return NextResponse.json(cart)
}

export async function POST(req) {
  await connectDB()
  const guard = requireAuth()
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status })
  const body = await req.json()
  const { value, error } = cartItemSchema.validate(body)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  const product = await Product.findById(value.productId)
  if (!product || !product.active) return NextResponse.json({ error: 'Product unavailable' }, { status: 400 })
  const cart = await getOrCreateCart(guard.user.id)
  const idx = cart.items.findIndex(i => i.product.toString() === product._id.toString())
  if (idx > -1) {
    cart.items[idx].quantity += value.quantity
  } else {
    cart.items.push({ product: product._id, quantity: value.quantity, priceAtAdd: product.price })
  }
  await cart.save()
  return NextResponse.json(cart)
}

export async function PUT(req) {
  await connectDB()
  const guard = requireAuth()
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status })
  const body = await req.json()
  const cart = await getOrCreateCart(guard.user.id)
  if (typeof body.couponCode === 'string') {
    cart.couponCode = body.couponCode
    await cart.save()
    return NextResponse.json(cart)
  }
  const { value, error } = cartItemSchema.validate(body)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  const idx = cart.items.findIndex(i => i.product.toString() === value.productId)
  if (idx === -1) return NextResponse.json({ error: 'Item not in cart' }, { status: 404 })
  cart.items[idx].quantity = value.quantity
  if (cart.items[idx].quantity <= 0) cart.items.splice(idx, 1)
  await cart.save()
  return NextResponse.json(cart)
}

export async function DELETE(req) {
  await connectDB()
  const guard = requireAuth()
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status })
  const body = await req.json().catch(() => ({}))
  const cart = await getOrCreateCart(guard.user.id)
  if (body?.productId) {
    cart.items = cart.items.filter(i => i.product.toString() !== body.productId)
  } else {
    cart.items = []
  }
  await cart.save()
  return NextResponse.json(cart)
}
