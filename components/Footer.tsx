'use client'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-navy via-navy to-navy text-white py-12">
      <div className="max-w-7xl mx-auto px-5 mb-8">
        <div className="grid grid-cols-5 gap-8">
          {/* Brand */}
          <div>
            <h4 className="text-lg font-black mb-4">Ma Boîte à Jouets</h4>
            <p className="text-sm text-gray-300 mb-4">
              Votre partenaire de confiance pour des jouets d'éveil de qualité premium.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-rose/20 rounded-full flex items-center justify-center hover:bg-rose transition">f</a>
              <a href="#" className="w-10 h-10 bg-rose/20 rounded-full flex items-center justify-center hover:bg-rose transition">📷</a>
              <a href="#" className="w-10 h-10 bg-rose/20 rounded-full flex items-center justify-center hover:bg-rose transition">𝕏</a>
            </div>
          </div>

          {/* Boutique */}
          <div>
            <h4 className="text-lg font-bold mb-4">Boutique</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-rose transition">Tous les produits</a></li>
              <li><a href="#" className="hover:text-rose transition">Nouveautés</a></li>
              <li><a href="#" className="hover:text-rose transition">En promotion</a></li>
              <li><a href="#" className="hover:text-rose transition">Best sellers</a></li>
            </ul>
          </div>

          {/* Infos */}
          <div>
            <h4 className="text-lg font-bold mb-4">Informations</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-rose transition">À propos</a></li>
              <li><a href="#" className="hover:text-rose transition">Livraison</a></li>
              <li><a href="#" className="hover:text-rose transition">Retours</a></li>
              <li><a href="#" className="hover:text-rose transition">FAQ</a></li>
            </ul>
          </div>

          {/* Compte */}
          <div>
            <h4 className="text-lg font-bold mb-4">Mon compte</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-rose transition">Connexion</a></li>
              <li><a href="#" className="hover:text-rose transition">Inscription</a></li>
              <li><a href="#" className="hover:text-rose transition">Mes commandes</a></li>
              <li><a href="#" className="hover:text-rose transition">Mes favoris</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-300 mb-3">Restez informé de nos promotions.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-3 py-2 bg-white/10 rounded text-sm text-white placeholder-gray-400 focus:outline-none"
              />
              <button className="bg-rose px-4 py-2 rounded font-bold hover:bg-red-600 transition">✓</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 pt-8">
        <div className="max-w-7xl mx-auto px-5 text-center text-sm text-gray-300">
          <p>© 2024 Ma Boîte à Jouets. Tous droits réservés.</p>
          <div className="mt-4 space-x-6">
            <a href="#" className="hover:text-rose transition">Mentions légales</a>
            <span>|</span>
            <a href="#" className="hover:text-rose transition">Politique de confidentialité</a>
            <span>|</span>
            <a href="#" className="hover:text-rose transition">CGV</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
