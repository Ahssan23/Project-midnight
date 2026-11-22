import Link from "next/link";
import { verifyEmailAction } from "./action";

type VerifyEmailPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const result = await verifyEmailAction(token ?? "");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <Link href="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">R</span>
          Rental Manager
        </Link>
        <h1 className="text-2xl font-semibold">{result?.ok ? "Email verified" : "Email verification"}</h1>
        <p className={`mt-3 text-sm ${result?.ok ? "text-emerald-700" : "text-slate-600"}`} role="status">
          {result?.message}
        </p>
        <Link href="/login" className="mt-8 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
          Continue to login
        </Link>
      </section>
    </main>
  );
}
