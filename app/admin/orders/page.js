'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminOrders() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me').then(r=>r.json()).then(j=>{
      if (!j.user || j.user.role !== 'admin') router.replace('/admin/login')
      else setUser(j.user)
    })
    fetch('/api/orders').then(r=>r.json()).then(setOrders)
  }, [router])

  if (!user) return null
  return (
    <div>
      <h1>Orders</h1>
      <table className="table">
        <thead><tr><th>Date</th><th>User</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td>{o.user?.email || o.user}</td>
              <td>{o.items.reduce((s,i)=>s+i.quantity,0)}</td>
              <td>${Number(o.total).toFixed(2)}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
