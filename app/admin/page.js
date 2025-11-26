'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [analytics, setAnalytics] = useState([])
  const [top, setTop] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me').then(r=>r.json()).then(j=>{
      if (!j.user || j.user.role !== 'admin') router.replace('/admin/login')
      else setUser(j.user)
    })
    fetch('/api/analytics/monthly-sales').then(r=>r.ok?r.json():[]).then(setAnalytics)
    fetch('/api/products?limit=5&sort=sold:desc').then(r=>r.json()).then(j=>setTop(j.items||[]))
  }, [router])

  const totals = analytics.reduce((acc,d)=>({ orders: acc.orders + d.orders, revenue: acc.revenue + d.revenue }), { orders:0, revenue:0 })

  if (!user) return null
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="grid" style={{gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))'}}>
        <div className="card"><div>Total Revenue</div><div style={{fontSize:24,fontWeight:700}}>${totals.revenue?.toFixed?.(2) || '0.00'}</div></div>
        <div className="card"><div>Total Orders</div><div style={{fontSize:24,fontWeight:700}}>{totals.orders || 0}</div></div>
        <div className="card"><div>Quick Links</div><div className="row"><Link className="btn" href="/admin/products">Manage Products</Link><Link className="btn" href="/admin/orders">View Orders</Link></div></div>
      </div>
      <h3 style={{marginTop:24}}>Top Products</h3>
      <ul>
        {top.map(p => <li key={p._id}>{p.title} — Sold: {p.sold}</li>)}
      </ul>
    </div>
  )
}
