'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function checkout() {
    setLoading(true)
    // simulate payment
    const pay = await fetch('/api/payment/simulate', { method: 'POST' })
    if (!pay.ok) { setLoading(false); return alert('Payment failed') }
    const res = await fetch('/api/orders', { method: 'POST' })
    setLoading(false)
    if (res.ok) {
      const order = await res.json()
      router.push(`/order/${order._id}`)
    } else {
      const j = await res.json().catch(()=>({}))
      alert(j.error || 'Order failed')
    }
  }

  return (
    <div>
      <h1>Checkout</h1>
      <p>This is a mock checkout. Clicking the button will simulate a successful payment and place the order.</p>
      <button className="btn primary" onClick={checkout} disabled={loading}>{loading? 'Processing...' : 'Pay and Place Order'}</button>
    </div>
  )
}
