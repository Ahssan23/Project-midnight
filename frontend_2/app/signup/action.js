"use server";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000/api";
const API_URL = `${API_BASE_URL.replace(/\/$/, "")}/signup`;

export async function signupAction(formData) {
  const role = String(formData.get("role") ?? "").trim().toLowerCase();
  if (role !== "buyer" && role !== "seller") {
    return {
      ok: false,
      message: "Choose either a buyer or seller account.",
    };
  }

  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    role,
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
      message:
        data.message ??
        data.error ??
        (response.ok ? "Account created, check your email." : "Signup failed."),
    };
  } catch {
    return {
      ok: false,
      message: "Could not connect to the signup API.",
    };
  }
}
