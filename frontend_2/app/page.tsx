import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserRole } from "@/lib/auth";

export default async function HomePage() {
  const result = await getCurrentUserRole();

  if (result.status === "unauthenticated") {
    redirect("/login");
  }
  if (result.status === "unavailable") {
    return (
      <main className="basic-shell">
        <section className="basic-section">
          <h1>Couldn’t check your account</h1>
          <p className="basic-muted basic-message">
            The account verification service did not respond. Try again in a moment.
          </p>
          <Link href="/" className="basic-primary-button" style={{ marginTop: 16 }}>
            Try again
          </Link>
        </section>
      </main>
    );
  }

  redirect(result.role === "seller" ? "/showroom" : "/cars");
}
