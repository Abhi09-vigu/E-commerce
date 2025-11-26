import Link from 'next/link'
import Hero from '@/components/Hero'
import NewsletterBar from '@/components/NewsletterBar'
import { headers } from 'next/headers'

async function fetchProducts(searchParams) {
  const page = searchParams?.page || '1'
  const q = searchParams?.q || ''
  const category = searchParams?.category || ''
  const hdrs = headers()
  const host = hdrs.get('host')
  const proto = hdrs.get('x-forwarded-proto') || 'http'
  const base = process.env.NEXT_PUBLIC_BASE_URL || `${proto}://${host}`
  const res = await fetch(`${base}/api/products?page=${page}&q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`, { cache: 'no-store' })
  if (!res.ok) return { items: [], total: 0, page: Number(page), limit: 12 }
  return res.json()
}

export default async function Home({ searchParams }) {
  const { items = [], total = 0, page = 1, limit = 12 } = await fetchProducts(searchParams)
  const pages = Math.ceil(total / limit) || 1
  return (
    <div>
      <Hero />
      <h2 id="products" className="text-xl font-semibold mb-4">Featured Products</h2>
      <div className="grid gap-4 products-grid">
        {items.map(p => (
          <div key={p._id} className="card hover:shadow-md transition-shadow">
            {p.imageUrl ? (
              <img src={p.imageUrl} alt={p.title} className="w-full h-40 object-cover rounded-lg"/>
            ) : null}
            <div className="mt-2 font-semibold">{p.title}</div>
            <div className="text-[var(--muted)]">${p.price?.toFixed?.(2)}</div>
            <div className="flex items-center justify-between mt-2">
              <Link className="btn" href={`/product/${p._id}`}>View</Link>
              <small className="text-[var(--muted)]">Stock: {p.stock}</small>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({length: pages}).map((_,i) => (
          <Link key={i} href={`/?page=${i+1}`} className={`btn ${((i+1)==page)?'font-bold':''}`}>{i+1}</Link>
        ))}
      </div>
      <NewsletterBar />
    </div>
  )
}
