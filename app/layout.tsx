import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ma Boîte à Jouets - Jouets d\'éveil premium pour enfants',
  description: 'Découvrez notre collection de jouets d\'éveil et sensoriels pour enfants de 2 à 10 ans. Qualité premium, livraison 48h en France.',
  openGraph: {
    title: 'Ma Boîte à Jouets',
    description: 'Jouets d\'éveil et sensoriels premium pour enfants 2-10 ans',
    url: 'https://maboiteajouets.fr',
    images: [{
      url: 'https://maboiteajouets.fr/og-image.jpg',
      width: 1200,
      height: 630,
    }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-cream text-navy">
        {children}
      </body>
    </html>
  )
}
