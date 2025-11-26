'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EditProduct({ params }) {
  const { id } = params
  const [user, setUser] = useState(null)
  const [form, setForm] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me').then(r=>r.json()).then(j=>{
      if (!j.user || j.user.role !== 'admin') router.replace('/admin/login')
      else setUser(j.user)
    })
    fetch('/api/products/'+id).then(r=>r.json()).then(p=>{
      setForm({ title:p.title, price:String(p.price), stock:String(p.stock), category:p.category||'', description:p.description||'', imageUrl:p.imageUrl||'', active: !!p.active, featured: !!p.featured })
    })
  }, [router, id])

  async function submit(e){
    e.preventDefault()
    const res = await fetch('/api/products/'+id, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) }) })
    if (res.ok) router.push('/admin/products')
    else alert('Failed')
  }

  if (!user || !form) return null
  return (
    <form onSubmit={submit} className="card" style={{maxWidth:700}}>
      <h1>Edit Product</h1>
      <label>Title<br/><input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required/></label>
      <br/>
      <label>Price<br/><input type="number" step="0.01" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} required/></label>
      <br/>
      <label>Stock<br/><input type="number" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} required/></label>
      <br/>
      <label>Category<br/><input value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}/></label>
      <br/>
      <label>Image URL<br/><input value={form.imageUrl} onChange={e=>setForm(f=>({...f,imageUrl:e.target.value}))}/></label>
      <br/>
      <label className="row"><input type="checkbox" checked={form.active} onChange={e=>setForm(f=>({...f,active:e.target.checked}))}/> Active</label>
      <br/>
      <label className="row"><input type="checkbox" checked={form.featured} onChange={e=>setForm(f=>({...f,featured:e.target.checked}))}/> Featured</label>
      <br/>
      <button className="btn primary">Save</button>
    </form>
  )
}
