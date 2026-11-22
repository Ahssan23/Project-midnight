import Link from "next/link";

type AuthMode = "login" | "signup" | "forgot-pass";

export function AuthShell({
  mode,
  children,
}: {
  mode: AuthMode;
  children: React.ReactNode;
}) {
  const isLogin = mode === "login";
  const isForgotPassword = mode === "forgot-pass";
  const heading = isForgotPassword
    ? "Forgot your password?"
    : isLogin
      ? "Welcome back"
      : "Create an account";
  const description = isForgotPassword
    ? "Enter your email address and we’ll send you a password reset link."
    : isLogin
      ? "Log in to browse cars or manage your rental showroom."
      : "Create a buyer or seller account to get started.";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <Link href="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            R
          </span>
          Rental Manager
        </Link>

        <h1 className="text-2xl font-semibold">{heading}</h1>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
        <div className="mt-8">{children}</div>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isForgotPassword
            ? "Remembered your password? "
            : isLogin
              ? "New here? "
              : "Already registered? "}
          <Link
            className="font-medium text-blue-600"
            href={isLogin ? "/signup" : "/login"}
          >
            {isLogin ? "Create an account" : "Log in"}
          </Link>
        </p>
      </section>
    </main>
  );
}
