"use server";

const API_URL = `${process.env.API_BASE_URL ?? "http://localhost:4000/api"}/pass-reset/reset`;

export async function passResetAction(token, formData) {
  const password = String(formData.get("password") ?? "");

  if (!token) {
    return { ok: false, message: "The password reset link is missing its token." };
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        ok: false,
        message: data.message ?? data.error ?? "Could not reset your password.",
      };
    }

    return { ok: true, message: data.message ?? "Your password has been reset." };
  } catch {
    return { ok: false, message: "Could not connect to the password reset API." };
  }
}
