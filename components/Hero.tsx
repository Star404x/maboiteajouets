'use client'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-rose/10 to-red-100/10 rounded-3xl p-12 mb-12 grid grid-cols-2 gap-10 items-center">
      {/* Content */}
      <div className="flex flex-col gap-5">
        <h1 className="text-5xl font-black text-navy leading-tight animate-fadeInUp">
          Le bonheur commence <em className="text-rose not-italic font-black">ici</em>
        </h1>
        
        <p className="text-lg text-gray-600 leading-relaxed animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          Découvrez notre collection de jouets d'éveil et sensoriels pour enfants de 2 à 10 ans. 
          Qualité premium, livraison rapide.
        </p>
        
        <button 
          className="w-fit bg-gradient-to-r from-rose to-red-600 text-white px-10 py-4 rounded-lg font-bold transition hover:shadow-lg hover:scale-105"
          style={{animationDelay: '0.2s'}}
        >
          Découvrir la collection
        </button>
      </div>

      {/* Image */}
      <div 
        className="w-full h-80 bg-gradient-to-br from-rose via-red-600 to-yellow rounded-2xl flex items-center justify-center text-9xl animate-fadeInRight"
        style={{animationDelay: '0.1s'}}
      >
        🎁
      </div>
    </section>
  )
}
