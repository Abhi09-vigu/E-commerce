'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me').then(r=>r.json()).then(j=>{
      if (j.user?.role === 'admin') router.replace('/admin')
    })
  }, [router])

  async function submit(e){
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
    setLoading(false)
    if (res.ok) {
      const u = await fetch('/api/auth/me').then(r=>r.json())
      if (u.user?.role === 'admin') router.push('/admin')
      else alert('Not an admin account')
    } else alert('Login failed')
  }
  return (
    <form onSubmit={submit} className="card" style={{maxWidth:420,margin:'0 auto'}}>
      <h1>Admin Login</h1>
      <label>Email<br/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
      <br/>
      <label>Password<br/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
      <br/>
      <button className="btn primary" disabled={loading}>{loading? '...' : 'Login'}</button>
    </form>
  )
}
