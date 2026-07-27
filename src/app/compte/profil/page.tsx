/**
 * /compte/profil - User profile management
 */

import { Metadata } from "next";
import { ProtectedRoute } from "@/components/account/ProtectedRoute";
import { ProfileForm } from "@/components/account/ProfileForm";

export const metadata: Metadata = {
  title: "Mon Profil",
  description: "Gérer votre profil personnel",
};

export default function ProfilPage() {
  return (
    <ProtectedRoute>
      <div className="container-wide py-8 lg:py-14">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-navy text-3xl mb-8">Mon Profil</h1>
          <ProfileForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}
