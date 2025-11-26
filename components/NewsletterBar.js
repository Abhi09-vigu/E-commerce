"use client"
import { useState } from 'react'

export default function NewsletterBar(){
  const [email,setEmail] = useState('')
  const [submitted,setSubmitted] = useState(false)
  function submit(e){
    e.preventDefault();
    // Mock submit
    setSubmitted(true)
    setTimeout(()=> setEmail(''), 600)
  }
  return (
    <div className="mt-16 mb-10 bg-slate-900 text-white rounded-xl p-8 flex flex-col md:flex-row items-center gap-6">
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-1">Stay in the loop</h3>
        <p className="text-sm text-slate-300">Get product updates, limited drops, and exclusive offers straight to your inbox.</p>
      </div>
      <form onSubmit={submit} className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
        <input type="email" required placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} className="flex-1 px-4 py-2 rounded-md border border-slate-700 bg-slate-800 text-white placeholder:text-slate-400"/>
        <button className="btn primary w-full sm:w-auto">{submitted? 'Subscribed!' : 'Subscribe'}</button>
      </form>
    </div>
  )
}
