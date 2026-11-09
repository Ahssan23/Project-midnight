"use server";

const API_URL = `${process.env.API_BASE_URL ?? "http://localhost:4000/api"}/signup`;

export async function signupAction(formData) {
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    role: String(formData.get("role") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    return {
      ok: response.ok,
      message: data.message ?? data.error ?? (response.ok ? "Account created." : "Signup failed."),
    };
  } catch {
    return { ok: false, message: "Could not connect to the signup API." };
  }
}
