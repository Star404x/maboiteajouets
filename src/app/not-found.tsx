import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-wide py-14 lg:py-20 text-center">
      <div className="max-w-lg mx-auto">
        <div className="relative mx-auto w-64 h-64 mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-hero blur-2xl opacity-70" />
          <div className="relative flex items-center justify-center h-full text-[8rem]">
            🧸
          </div>
          <div className="absolute top-2 right-8 text-3xl">⭐</div>
          <div className="absolute bottom-2 left-8 text-3xl">✨</div>
        </div>

        <p className="text-xs font-bold uppercase tracking-wider text-coral mb-2">
          Erreur 404
        </p>
        <h1 className="font-display font-bold text-navy text-display-md md:text-display-lg text-balance mb-4">
          Cette page joue à cache-cache !
        </h1>
        <p className="text-navy/70 mb-8 text-lg text-balance">
          La page que vous cherchez n'existe pas (ou plus). Mais on a plein d'autres jouets à vous montrer.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/boutique">
              <Search className="w-4 h-4" />
              Explorer la boutique
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
