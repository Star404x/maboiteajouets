'use client'

const categories = [
  { icon: '🧸', name: 'Peluches', bg: 'bg-gradient-to-br from-blue-100 to-blue-50' },
  { icon: '🧩', name: 'Jouets éducatifs', bg: 'bg-gradient-to-br from-red-100 to-red-50' },
  { icon: '🚗', name: 'Véhicules', bg: 'bg-gradient-to-br from-yellow-100 to-yellow-50' },
  { icon: '🎲', name: 'Jeux de société', bg: 'bg-gradient-to-br from-green-100 to-green-50' },
  { icon: '👶', name: 'Jouets bébé', bg: 'bg-gradient-to-br from-purple-100 to-purple-50' },
  { icon: '🏃', name: 'Jeux d\'extérieur', bg: 'bg-gradient-to-br from-red-100 to-red-50' },
]

export default function Categories() {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-black text-navy mb-6">
        Nos <em className="text-rose not-italic">catégories</em>
      </h2>
      
      <div className="grid grid-cols-3 gap-5">
        {categories.map((cat, idx) => (
          <div
            key={cat.name}
            className={`${cat.bg} rounded-2xl p-6 text-center cursor-pointer transition transform hover:shadow-lg hover:scale-105 hover:border-rose border-2 border-transparent opacity-0 animate-fadeInUp`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="text-6xl mb-3 inline-block transition group-hover:scale-125">
              {cat.icon}
            </div>
            <p className="text-lg font-bold text-navy">{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
