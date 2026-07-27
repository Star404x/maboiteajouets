/**
 * /compte - User dashboard main page
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/account/ProtectedRoute';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';

function DashboardContent() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <div className="container-wide py-8 lg:py-14">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="font-display font-bold text-navy text-3xl mb-2">Bienvenue, {user?.full_name || 'Utilisateur'}</h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profil */}
          <Link href="/compte/profil">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-3xl mb-3">👤</div>
              <h2 className="font-semibold text-lg text-navy mb-2">Mon Profil</h2>
              <p className="text-gray-600 text-sm">Modifier mes informations personnelles</p>
            </div>
          </Link>

          {/* Commandes */}
          <Link href="/compte/commandes">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-3xl mb-3">📦</div>
              <h2 className="font-semibold text-lg text-navy mb-2">Mes Commandes</h2>
              <p className="text-gray-600 text-sm">Voir l'historique de mes achats</p>
            </div>
          </Link>

          {/* Adresses */}
          <Link href="/compte/adresses">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-3xl mb-3">📍</div>
              <h2 className="font-semibold text-lg text-navy mb-2">Mes Adresses</h2>
              <p className="text-gray-600 text-sm">Gérer mes adresses de livraison</p>
            </div>
          </Link>

          {/* Favoris */}
          <Link href="/compte/favoris">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-3xl mb-3">❤️</div>
              <h2 className="font-semibold text-lg text-navy mb-2">Mes Favoris</h2>
              <p className="text-gray-600 text-sm">Ma liste de souhaits</p>
            </div>
          </Link>

          {/* Paramètres */}
          <Link href="/compte/parametres">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-3xl mb-3">⚙️</div>
              <h2 className="font-semibold text-lg text-navy mb-2">Paramètres</h2>
              <p className="text-gray-600 text-sm">Sécurité et préférences</p>
            </div>
          </Link>

          {/* Déconnexion */}
          <button
            onClick={() => {
              localStorage.removeItem('auth_token');
              router.push('/connexion');
            }}
            className="border border-red-200 bg-red-50 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer text-left"
          >
            <div className="text-3xl mb-3">🚪</div>
            <h2 className="font-semibold text-lg text-red-600 mb-2">Se Déconnecter</h2>
            <p className="text-red-600 text-sm">Quitter votre compte</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ComptePage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
