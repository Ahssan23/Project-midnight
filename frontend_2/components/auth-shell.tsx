import Link from "next/link";

export function AuthShell({ mode, children }: { mode: "login" | "signup"; children: React.ReactNode }) {
  const login = mode === "login";
  return <main className="flex min-h-screen items-center justify-center px-4 py-12">
    <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
      <Link href="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold"><span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">R</span>Rental Manager</Link>
      <h1 className="text-2xl font-semibold">{login ? "Welcome back" : "Create an account"}</h1>
      <p className="mt-2 text-sm text-slate-500">{login ? "Log in to manage your rental business." : "Sign up to get started."}</p>
      <div className="mt-8">{children}</div>
      <p className="mt-6 text-center text-sm text-slate-500">{login ? "New here? " : "Already registered? "}<Link className="font-medium text-blue-600" href={login ? "/signup" : "/login"}>{login ? "Create an account" : "Log in"}</Link></p>
    </section>
  </main>;
}
