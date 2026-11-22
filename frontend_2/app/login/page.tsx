import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthShell mode="login">
      {error === "role-check" && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          We couldn’t verify your account type. Please try logging in again.
        </p>
      )}
      <LoginForm />
    </AuthShell>
  );
}
