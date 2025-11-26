export const metadata = {
  title: 'E-commerce',
  description: 'Minimal e‑commerce foundation with Next.js',
}

import './globals.css'
import { getAuthUser } from '@/lib/auth'
import LogoutButton from '@/components/LogoutButton'

export default function RootLayout({ children }) {
  const user = getAuthUser()
  return (
    <html lang="en">
      <body>
        <div className="bg-brand text-white text-xs tracking-wide py-1 text-center">Free shipping on orders over $50</div>
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-[var(--border)]">
          <div className="max-w-[1100px] mx-auto flex items-center justify-between px-4 py-4">
            <a href="/" className="font-bold text-lg">My Shop</a>
            <nav className="flex items-center gap-3 text-sm text-[var(--muted)]">
              <a href="/" className="hover:text-black">Products</a>
              <a href="/cart" className="hover:text-black">Cart</a>
              {!user && <a href="/login" className="hover:text-black">Login</a>}
              {!user && <a href="/register" className="hover:text-black">Register</a>}
              {(!user || user.role !== 'admin') && <a href="/admin/login" className="hover:text-black">Admin Login</a>}
              {user?.role === 'admin' && <a href="/admin" className="hover:text-black">Admin</a>}
              {user && <LogoutButton />}
            </nav>
          </div>
        </header>
        <main className="max-w-[1100px] mx-auto my-5 px-4">
          {children}
        </main>
        <footer className="px-4 py-4 border-t border-[var(--border)] text-center">© {new Date().getFullYear()} My Shop</footer>
      </body>
    </html>
  )
}
