'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    const r = await fetch('/api/cart', { cache: 'no-store' })
    if (r.ok) setCart(await r.json())
    else setCart({ items: [] })
  }
  useEffect(() => { load() }, [])

  const subtotal = useMemo(() => (cart?.items||[]).reduce((s,i)=> s + i.priceAtAdd * i.quantity, 0), [cart])

  async function updateItem(productId, quantity) {
    setLoading(true)
    await fetch('/api/cart', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ productId, quantity }) })
    setLoading(false)
    load()
  }

  async function removeItem(productId) {
    setLoading(true)
    await fetch('/api/cart', { method: 'DELETE', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ productId }) })
    setLoading(false)
    load()
  }

  if (!cart) return <div>Loading...</div>
  return (
    <div>
      <h1>Cart</h1>
      {cart.items.length === 0 && <p>Your cart is empty.</p>}
      {cart.items.length > 0 && (
        <table className="table">
          <thead>
            <tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr>
          </thead>
          <tbody>
            {cart.items.map(i => (
              <tr key={i.product}>
                <td>{i.product}</td>
                <td>${i.priceAtAdd.toFixed(2)}</td>
                <td>
                  <input type="number" min="1" defaultValue={i.quantity} onChange={e=>updateItem(i.product, Number(e.target.value))} style={{width:80}} disabled={loading}/>
                </td>
                <td>${(i.priceAtAdd * i.quantity).toFixed(2)}</td>
                <td><button className="btn" onClick={()=>removeItem(i.product)} disabled={loading}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="row" style={{justifyContent:'space-between',marginTop:16}}>
        <div>Subtotal: <strong>${subtotal.toFixed(2)}</strong></div>
        <Link className="btn primary" href="/checkout">Proceed to Checkout</Link>
      </div>
    </div>
  )
}
