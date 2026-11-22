import Link from "next/link";
import { PassResetForm } from "@/components/pass-reset-form";

type PassResetPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function PassResetPage({ searchParams }: PassResetPageProps) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <Link href="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">R</span>
          Rental Manager
        </Link>
        <h1 className="text-2xl font-semibold">Set a new password</h1>
        <p className="mt-2 text-sm text-slate-500">Choose a new password for your account.</p>
        <div className="mt-8">
          <PassResetForm token={token ?? ""} />
        </div>
      </section>
    </main>
  );
}
