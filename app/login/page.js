'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  async function submit(e){
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
    setLoading(false)
    if (res.ok) router.push('/')
    else alert('Login failed')
  }
  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={submit} className="card">
        <h1 className="text-xl font-semibold mb-2">Login</h1>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-[var(--muted)]">Email</label>
            <input className="mt-1 w-full border border-[var(--border)] rounded-md px-3 py-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
          </div>
          <div>
            <label className="block text-sm text-[var(--muted)]">Password</label>
            <input className="mt-1 w-full border border-[var(--border)] rounded-md px-3 py-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          </div>
          <button className="btn primary w-full" disabled={loading}>{loading? '...' : 'Login'}</button>
        </div>
        <div className="text-sm text-[var(--muted)] mt-3">No account? <a className="underline" href="/register">Create one</a></div>
      </form>
    </div>
  )
}
