'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminProducts() {
  const [user, setUser] = useState(null)
  const [data, setData] = useState({ items: [] })
  const router = useRouter()

  async function load(){
    const r = await fetch('/api/products?limit=100')
    setData(await r.json())
  }

  useEffect(() => {
    fetch('/api/auth/me').then(r=>r.json()).then(j=>{
      if (!j.user || j.user.role !== 'admin') router.replace('/admin/login')
      else setUser(j.user)
    })
    load()
  }, [router])

  async function del(id){
    if (!confirm('Delete product?')) return
    await fetch('/api/products/'+id, { method:'DELETE' })
    load()
  }

  if (!user) return null
  return (
    <div>
      <h1>Products</h1>
      <div className="row" style={{justifyContent:'space-between'}}>
        <div></div>
        <Link className="btn primary" href="/admin/products/new">Add Product</Link>
      </div>
      <table className="table" style={{marginTop:12}}>
        <thead><tr><th>Title</th><th>Price</th><th>Stock</th><th>Featured</th><th></th></tr></thead>
        <tbody>
          {data.items.map(p => (
            <tr key={p._id}>
              <td>{p.title}</td>
              <td>${Number(p.price).toFixed(2)}</td>
              <td>{p.stock}</td>
              <td>{p.featured ? '★' : ''}</td>
              <td className="row"><Link className="btn" href={`/admin/products/${p._id}`}>Edit</Link><button className="btn" onClick={()=>del(p._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
