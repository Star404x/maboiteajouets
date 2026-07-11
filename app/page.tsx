import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Categories from '@/components/Categories'
import Products from '@/components/Products'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="max-w-7xl mx-auto px-5 py-12">
        <div className="grid grid-cols-3 gap-8">
          {/* Left column */}
          <div className="col-span-2 space-y-12">
            <Hero />
            <Categories />
            <Products />
          </div>

          {/* Right sidebar */}
          <div className="col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
