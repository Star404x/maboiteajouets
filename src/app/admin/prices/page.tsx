import { redirect } from "next/navigation";

export default function AdminPricesPage() {
  // Redirect to client component
  redirect("/admin/prices-client");
}
