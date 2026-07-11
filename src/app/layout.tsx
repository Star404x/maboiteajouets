import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "@/components/ui/Toaster";
import { CookieBanner } from "@/components/legal/CookieBanner";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maboiteajouets.fr"),
  title: {
    default: "Ma Boîte à Jouets — Jouets premium pour enfants",
    template: "%s · Ma Boîte à Jouets",
  },
  description:
    "Découvrez notre collection de jouets d'éveil, sensoriels et éducatifs pour enfants de 0 à 12 ans. Qualité premium, livraison rapide en France.",
  keywords: [
    "jouets enfants",
    "jouets d'éveil",
    "jouets Montessori",
    "jouets bois",
    "cadeaux enfants",
    "peluches",
    "jeux éducatifs",
  ],
  authors: [{ name: "Ma Boîte à Jouets" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://maboiteajouets.fr",
    siteName: "Ma Boîte à Jouets",
    title: "Ma Boîte à Jouets — Jouets premium pour enfants",
    description:
      "Le bonheur commence ici. Jouets d'éveil et sensoriels pour enfants 0-12 ans.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ma Boîte à Jouets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ma Boîte à Jouets",
    description: "Jouets premium pour enfants 0-12 ans",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="min-h-screen flex flex-col">
        {/* Structured data — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Ma Boîte à Jouets",
              url: "https://maboiteajouets.fr",
              logo: "https://maboiteajouets.fr/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: ["French"],
              },
              sameAs: [
                "https://instagram.com/maboiteajouets",
                "https://facebook.com/maboiteajouets",
              ],
            }),
          }}
        />

        <Header />

        <main className="flex-1">{children}</main>

        <Footer />

        <CartDrawer />
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  );
}
