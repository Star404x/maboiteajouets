'use client'

export default function Header() {
  return (
    <header className="bg-cream/95 backdrop-blur-sm border-b border-rose/10 sticky top-0 z-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 py-5">
        <div className="flex items-center justify-between gap-10">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 no-underline">
            <div className="text-3xl font-black flex items-center gap-1">
              <span className="text-red-500">⭐</span>
              <span>
                <span className="text-red-500">M</span>
                <span className="text-yellow">a</span>
                <span className="text-green-500"> B</span>
                <span className="text-blue-500">o</span>
                <span className="text-rose">î</span>
                <span className="text-red-500">t</span>
                <span className="text-yellow">e</span>
              </span>
            </div>
            <div className="text-sm font-semibold text-navy">Jouets</div>
          </a>

          {/* Nav */}
          <nav className="hidden md:flex gap-8 items-center flex-1">
            <a href="#accueil" className="text-navy font-semibold text-sm hover:text-rose transition">Accueil</a>
            <a href="#boutique" className="text-navy font-semibold text-sm hover:text-rose transition">Boutique</a>
            <a href="#categories" className="text-navy font-semibold text-sm hover:text-rose transition">Catégories</a>
            <a href="#nouveautes" className="text-navy font-semibold text-sm hover:text-rose transition">Nouveautés</a>
            <a href="#apropos" className="text-navy font-semibold text-sm hover:text-rose transition">À propos</a>
            <a href="#contact" className="text-navy font-semibold text-sm hover:text-rose transition">Contact</a>
          </nav>

          {/* Actions */}
          <div className="flex gap-5 items-center">
            <button className="w-10 h-10 bg-rose/10 border-0 rounded-full cursor-pointer text-lg transition hover:bg-rose hover:text-white">
              🔍
            </button>
            <button className="w-10 h-10 bg-rose/10 border-0 rounded-full cursor-pointer text-lg transition hover:bg-rose hover:text-white">
              👤
            </button>
            <button className="w-10 h-10 bg-rose/10 border-0 rounded-full cursor-pointer text-lg transition hover:bg-rose hover:text-white relative">
              🛒
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-rose to-red-600 text-white rounded-full text-xs font-bold flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
