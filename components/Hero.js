export default function Hero() {
  return (
    <section className="relative rounded-xl overflow-hidden mb-10 h-[420px] flex items-center justify-center">
      <img
        src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=60"
        alt="Shop hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center px-6 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-wide text-white mb-3">Inside Our Atelier</h1>
        <p className="text-white/90 text-sm md:text-base mb-6">A sneak peek into our curated collection – crafted for quality, comfort, and timeless style.</p>
        <a href="#products" className="inline-block btn primary px-6 py-3 font-medium shadow-lg hover:shadow-xl">Shop Now</a>
      </div>
    </section>
  )
}
