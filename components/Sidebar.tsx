'use client'

const brands = ['LEGO', 'Playmobil', 'Vtech', 'Smoby', 'Janod']

const benefits = [
  { icon: '⚡', title: 'Livraison rapide', desc: '48h dans toute la France' },
  { icon: '🔒', title: 'Paiement sécurisé', desc: 'SSL & cryptage complet' },
  { icon: '↩️', title: 'Retours gratuits', desc: '30 jours pour changer d\'avis' },
  { icon: '💬', title: 'Support 24/7', desc: 'Réponse garantie' },
]

export default function Sidebar() {
  return (
    <div className="space-y-8">
      {/* Brands */}
      <div className="bg-white rounded-2xl p-6 border-2 border-rose/10">
        <h3 className="text-xl font-black text-navy mb-5">Des marques de confiance</h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <div
              key={brand}
              className="bg-gradient-to-r from-rose/10 to-red-100/10 p-4 rounded-lg text-center font-bold text-sm text-navy cursor-pointer transition hover:bg-gradient-to-r hover:from-rose hover:to-red-600 hover:text-white"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-2xl p-6 border-2 border-rose/10">
        <h3 className="text-xl font-black text-navy mb-5">Pourquoi choisir Ma boîte à jouets ?</h3>
        <div className="space-y-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex gap-3">
              <span className="text-3xl">{benefit.icon}</span>
              <div>
                <p className="font-bold text-navy text-sm">{benefit.title}</p>
                <p className="text-xs text-gray-600">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-white rounded-2xl p-6 border-2 border-rose/10">
        <h3 className="text-xl font-black text-navy mb-3">Faites plaisir, tout simplement!</h3>
        <p className="text-sm text-gray-600 mb-4">
          Inscrivez-vous pour recevoir nos dernières offres et nouveautés.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Votre email"
            className="flex-1 px-4 py-2 border border-rose/20 rounded-lg text-sm focus:outline-none focus:border-rose"
          />
          <button className="bg-gradient-to-r from-rose to-red-600 text-white px-6 py-2 rounded-lg font-bold transition hover:shadow-lg">
            ✓
          </button>
        </div>
      </div>
    </div>
  )
}
