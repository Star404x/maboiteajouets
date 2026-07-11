'use client'

interface ProductCardProps {
  icon: string
  badge: string
  name: string
  price: number
  rating: number
  reviews: number
  delay?: number
}

export default function ProductCard({ icon, badge, name, price, rating, reviews, delay = 0 }: ProductCardProps) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden transition transform hover:shadow-lg hover:scale-105 hover:border-rose border-2 border-transparent opacity-0 animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="w-full h-48 bg-gradient-to-br from-rose via-red-600 to-yellow flex items-center justify-center text-7xl relative overflow-hidden">
        {icon}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
      </div>

      {/* Badge */}
      <div className="absolute top-3 right-3 bg-gradient-to-r from-rose to-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold z-10">
        {badge}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-navy mb-2 line-clamp-2">{name}</h3>
        
        <p className="text-2xl font-black text-rose mb-3">€{price.toFixed(2)}</p>
        
        <div className="text-yellow mb-4">
          {'⭐'.repeat(rating)} <span className="text-gray-500 text-sm">({reviews})</span>
        </div>
        
        <button className="w-full bg-gradient-to-r from-rose to-red-600 text-white py-3 rounded-lg font-bold transition hover:shadow-lg hover:-translate-y-1">
          Ajouter au panier
        </button>
      </div>
    </div>
  )
}
