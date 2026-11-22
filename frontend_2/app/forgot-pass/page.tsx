import { AuthShell } from "@/components/auth-shell";
import { ForgotPassForm } from "@/components/forgot-pass-form";

export default function ForgotPassPage() {
  return (
    <AuthShell mode="forgot-pass">
      <ForgotPassForm />
    </AuthShell>
  );
}
