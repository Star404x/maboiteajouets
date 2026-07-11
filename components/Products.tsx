'use client'

import ProductCard from './ProductCard'

const products = [
  { icon: '🛏️', badge: 'Nouveau', name: 'Tapis d\'éveil XL', price: 49.99, rating: 5, reviews: 24 },
  { icon: '🪀', badge: 'Promo', name: 'Hochet sensoriel', price: 19.99, rating: 5, reviews: 18 },
  { icon: '🧩', badge: 'Top vente', name: 'Puzzle encastrement', price: 24.99, rating: 5, reviews: 31 },
  { icon: '🎭', badge: 'Nouveau', name: 'Cuisine de jeu', price: 89.99, rating: 5, reviews: 45 },
]

export default function Products() {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-black text-navy mb-6">
        Nos produits <em className="text-rose not-italic">coups de cœur</em>
      </h2>
      
      <div className="grid grid-cols-2 gap-6">
        {products.map((product, idx) => (
          <ProductCard
            key={product.name}
            icon={product.icon}
            badge={product.badge}
            name={product.name}
            price={product.price}
            rating={product.rating}
            reviews={product.reviews}
            delay={idx * 75}
          />
        ))}
      </div>
    </section>
  )
}
