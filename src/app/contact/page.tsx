import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PageHero } from "@/components/shared/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe Ma Boîte à Jouets. Nous répondons rapidement à toutes vos questions.",
  alternates: { canonical: "/contact" },
};

const INFO = [
  { Icon: Mail, label: "Email", value: "bonjour@maboiteajouets.fr" },
  { Icon: Phone, label: "Téléphone", value: "01 23 45 67 89" },
  { Icon: MapPin, label: "Adresse", value: "Paris, France" },
  { Icon: Clock, label: "Horaires", value: "Lun-Ven · 9h-18h" },
];

export default function ContactPage() {
  return (
    <div className="container-wide py-8 lg:py-14">
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <PageHero
        eyebrow="Une question ?"
        title="Contactez-nous"
        accent="Contactez-nous"
        description="Notre équipe est là pour vous aider. Réponse garantie sous 24h ouvrées."
      />

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-soft p-6 md:p-8">
          <h2 className="font-display font-bold text-navy text-xl mb-6">Écrivez-nous</h2>
          <ContactForm />
        </div>

        <div className="space-y-4">
          {INFO.map((i) => (
            <div key={i.label} className="p-5 rounded-3xl bg-white shadow-soft flex items-center gap-4">
              <div className="h-11 w-11 rounded-full bg-coral/10 inline-flex items-center justify-center">
                <i.Icon className="w-5 h-5 text-coral" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-navy/50">
                  {i.label}
                </p>
                <p className="font-semibold text-navy">{i.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
