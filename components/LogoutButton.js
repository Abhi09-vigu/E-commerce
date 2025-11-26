'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  async function logout(){
    setLoading(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    setLoading(false)
    router.push('/')
    router.refresh()
  }
  return (
    <button className="btn" onClick={logout} disabled={loading}>{loading ? '...' : 'Logout'}</button>
  )
}
