import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectDB } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import Cart from '@/models/Cart'
import Order from '@/models/Order'
import Product from '@/models/Product'
import Coupon from '@/models/Coupon'

export async function GET(req) {
  await connectDB()
  const guard = requireAuth('admin')
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status })
  const orders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'name email').lean()
  return NextResponse.json(orders)
}

export async function POST(req) {
  await connectDB()
  const guard = requireAuth()
  if (!guard.ok) return NextResponse.json({ error: guard.message }, { status: guard.status })
  const userId = guard.user.id

  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const cart = await Cart.findOne({ user: userId }).session(session)
    if (!cart || cart.items.length === 0) throw new Error('Cart empty')

    let subtotal = 0
    const items = []

    for (const ci of cart.items) {
      const p = await Product.findById(ci.product).session(session)
      if (!p || !p.active) throw new Error('Product unavailable')
      if (p.stock < ci.quantity) throw new Error(`Insufficient stock for ${p.title}`)
      p.stock -= ci.quantity
      p.sold += ci.quantity
      await p.save({ session })
      subtotal += p.price * ci.quantity
      items.push({ product: p._id, title: p.title, price: p.price, quantity: ci.quantity })
    }

    let discount = 0
    if (cart.couponCode) {
      const c = await Coupon.findOne({ code: cart.couponCode.toUpperCase() }).session(session)
      const now = new Date()
      if (c && c.active && (!c.expiresAt || c.expiresAt > now)) {
        if (c.type === 'percent') discount = Math.round((subtotal * c.value) * 100) / 100 / 100
        else discount = c.value
        if (discount > subtotal) discount = subtotal
      }
    }

    const total = Math.max(0, Math.round((subtotal - discount) * 100) / 100)

    const order = await Order.create([{ user: userId, items, subtotal, discount, total, status: 'paid', paymentRef: 'mock_' + Date.now() }], { session })

    cart.items = []
    cart.couponCode = ''
    await cart.save({ session })

    await session.commitTransaction()
    session.endSession()
    return NextResponse.json(order[0], { status: 201 })
  } catch (e) {
    await session.abortTransaction()
    session.endSession()
    return NextResponse.json({ error: e.message || 'Order failed' }, { status: 400 })
  }
}
