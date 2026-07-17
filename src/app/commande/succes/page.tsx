import Link from "next/link";
import { Check } from "lucide-react";

export const dynamic = "force-static";

export const metadata = {
  title: "Commande confirmée · Ma Boîte à Jouets",
  description: "Merci pour votre commande !",
};

export default function SuccessPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-mint/20 mx-auto mb-6 inline-flex items-center justify-center">
          <Check className="w-10 h-10 text-mint" strokeWidth={3} />
        </div>
        <h1 className="font-display font-bold text-navy text-3xl mb-3">
          Merci pour votre commande !
        </h1>
        <p className="text-navy/70 mb-6">
          Vous recevrez un email de confirmation dans quelques instants.
        </p>
        <Link
          href="/boutique"
          className="inline-flex items-center px-6 py-3 rounded-2xl bg-navy text-white font-semibold hover:bg-navy/90 transition-colors"
        >
          Continuer les achats
        </Link>
      </div>
    </div>
  );
}
