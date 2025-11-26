'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProductPage({ params }) {
  const { id } = params
  const [p, setP] = useState(null)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/products/' + id).then(r=>r.json()).then(setP)
  }, [id])

  async function addToCart() {
    setLoading(true)
    const res = await fetch('/api/cart', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ productId: id, quantity: Number(qty) }) })
    setLoading(false)
    if (res.ok) router.push('/cart')
    else alert('Login required or error adding to cart')
  }

  if (!p) return <div>Loading...</div>
  return (
    <div className="row" style={{alignItems:'flex-start'}}>
      <div style={{flex:1}}>
        {p.imageUrl ? <img src={p.imageUrl} alt={p.title} style={{width:'100%',maxWidth:500,borderRadius:8}}/> : null}
      </div>
      <div style={{flex:1}}>
        <h1>{p.title}</h1>
        <p style={{color:'var(--muted)'}}>{p.description}</p>
        <div style={{fontSize:22,fontWeight:700,margin:'8px 0'}}>${Number(p.price).toFixed(2)}</div>
        <div className="row">
          <input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} style={{width:80}}/>
          <button className="btn primary" onClick={addToCart} disabled={loading}>{loading? 'Adding...' : 'Add to cart'}</button>
        </div>
      </div>
    </div>
  )
}
