import { headers } from 'next/headers'

async function fetchOrder(id) {
  const hdrs = headers()
  const host = hdrs.get('host')
  const proto = hdrs.get('x-forwarded-proto') || 'http'
  const base = process.env.NEXT_PUBLIC_BASE_URL || `${proto}://${host}`
  const res = await fetch(`${base}/api/orders/${id}`, { cache: 'no-store' })
  return res.json()
}

export default async function OrderPage({ params }) {
  const order = await fetchOrder(params.id)
  if (order?.error) return <div>Unable to load order</div>
  return (
    <div>
      <h1>Order Confirmation</h1>
      <p>Order ID: <strong>{order._id}</strong></p>
      <p>Status: {order.status}</p>
      <h3>Items</h3>
      <ul>
        {order.items.map((i, idx) => (
          <li key={idx}>{i.title} x {i.quantity} — ${(i.price * i.quantity).toFixed(2)}</li>
        ))}
      </ul>
      <p>Subtotal: ${order.subtotal.toFixed(2)} | Discount: ${order.discount.toFixed(2)}</p>
      <p>Total: <strong>${order.total.toFixed(2)}</strong></p>
    </div>
  )
}
