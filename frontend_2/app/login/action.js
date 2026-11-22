"use server";

import { cookies } from "next/headers";
import { verifySellerToken } from "@/lib/auth";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000/api";
const API_URL = `${API_BASE_URL.replace(/\/$/, "")}/login`;

export async function loginAction(formData) {
  const usernameOrEmail = String(formData.get("usernameOrEmail") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameOrEmail,
        email: usernameOrEmail,
        password,
      }),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        ok: false,
        message: data.message ?? data.error ?? "Login failed.",
      };
    }

    const token =
      data.jwt_token ??
      data.token ??
      data.accessToken ??
      data.data?.jwt_token ??
      data.data?.token;

    if (!token) {
      return { ok: false, message: "Wrong credentials." };
    }

    const roleResult = await verifySellerToken(token);
    console.log(roleResult,'ROLERESULT--------')
    if (roleResult.status !== "authenticated") {
      return {
        ok: false,
        message:
          "Your account was verified, but we couldn’t confirm whether it is a buyer or seller. Please try again.",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return {
      ok: true,
      role: roleResult.role,
      message: data.message ?? "Login successful.",
    };
  } catch {
    return { ok: false, message: "Could not connect to the login API." };
  }
}
