import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { InstagramIcon, FacebookIcon, TikTokIcon } from "@/components/ui/SocialIcons";
import { FooterNewsletter } from "./FooterNewsletter";

const COLUMNS: Array<{
  title: string;
  links: Array<{ label: string; href: string }>;
}> = [
  {
    title: "Boutique",
    links: [
      { label: "Tous les produits", href: "/boutique" },
      { label: "Nouveautés", href: "/nouveautes" },
      { label: "Promotions", href: "/promotions" },
      { label: "Meilleures ventes", href: "/meilleures-ventes" },
    ],
  },
  {
    title: "Informations",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Livraison", href: "/livraison" },
      { label: "Retours et échanges", href: "/retours" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Mon compte",
    links: [
      { label: "Mon compte", href: "/compte" },
      { label: "Mes commandes", href: "/compte/commandes" },
      { label: "Mes favoris", href: "/favoris" },
      { label: "Se déconnecter", href: "/deconnexion" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white mt-24">
      <div className="container-wide py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Logo onDark className="mb-4" />
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
              Votre boutique française de jouets premium pour enfants. Livraison rapide,
              qualité garantie, sourire assuré.
            </p>
            <div className="flex items-center gap-2">
              {[
                { Icon: InstagramIcon, label: "Instagram", href: "#" },
                { Icon: FacebookIcon, label: "Facebook", href: "#" },
                { Icon: TikTokIcon, label: "TikTok", href: "#" },
              ].map(({ Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-coral transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-coral text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter mini */}
        <div className="mt-14 pt-10 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-coral shrink-0" />
            <p className="text-sm text-white/80">
              <span className="font-semibold">Restons en contact.</span> Recevez nos idées cadeaux et offres exclusives.
            </p>
          </div>
          <FooterNewsletter />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-wide py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/60">
            © 2026 Ma Boîte à Jouets — Tous droits réservés
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/60">
            <Link href="/mentions-legales" className="hover:text-coral">Mentions légales</Link>
            <Link href="/cgv" className="hover:text-coral">CGV</Link>
            <Link href="/confidentialite" className="hover:text-coral">Politique de confidentialité</Link>
            <Link href="/cookies" className="hover:text-coral">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
