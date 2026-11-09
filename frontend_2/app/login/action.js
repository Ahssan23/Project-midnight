"use server";

import { cookies } from "next/headers";

const API_URL = `${process.env.API_BASE_URL ?? "http://localhost:4000/api"}/login`;



export async function loginAction(formData) {
  const usernameOrEmail = String(formData.get("usernameOrEmail") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Send both common login field names so either backend convention works.
      body: JSON.stringify({ username: usernameOrEmail, email: usernameOrEmail, password }),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return { ok: false, message: data.message ?? data.error ?? "Login failed." };
    if (data) (await cookies()).set("access_token", data.jwt_token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
    return { ok: true, message: data.message ?? "Login successful." };
  } catch (err){
    console.log(err);
    return { ok: false, message: "Could not connect to the login API." };
  }
}
