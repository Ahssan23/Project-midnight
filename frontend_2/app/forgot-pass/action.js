"use server";

const API_URL = `${process.env.API_BASE_URL ?? "http://localhost:4000/api"}/pass-reset/forgot`;

export async function forgotPassAction(formData) {
  const email = String(formData.get("email") ?? "").trim();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        ok: false,
        message: data.message ?? data.error ?? "Could not send the password reset email.",
      };
    }

    return {
      ok: true,
      message: data.message ?? "If an account exists for that email, a password reset link is on its way.",
    };
  } catch {
    return { ok: false, message: "Could not connect to the password reset API." };
  }
}
