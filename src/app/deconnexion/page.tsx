import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Déconnexion",
  robots: { index: false, follow: false },
};

export default function LogoutPage() {
  // In production: clear session, delete cookies, then redirect to home
  // For now: display message and offer redirect
  redirect("/");
}
