"use server";

import { cookies } from "next/headers";

const API_URL = `${process.env.API_BASE_URL ?? "http://localhost:4000/api"}/showroom`;

export async function createShowroomAction(formData) {
  const token = (await cookies()).get("token")?.value;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}`, Cookie: `access_token=${encodeURIComponent(token)}` } : {}),
      },
      body: JSON.stringify({
        ShowroomName: String(formData.get("ShowroomName") ?? "").trim(),
        OwnernName: String(formData.get("OwnernName") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
      }),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    const cookieToken = (response.headers.get("set-cookie") ?? "").match(/(?:^|,\s*)accesstoken=([^;,\s]+)/i)?.[1];
    const newToken = data.token ?? data.accessToken ?? data.data?.token ?? (cookieToken ? decodeURIComponent(cookieToken) : undefined);

    if (newToken && response.ok) {
      (await cookies()).set("token", newToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
    }

    return {
      ok: response.ok,
      data,
      message: data.message ?? data.error ?? (response.ok ? "Showroom created." : "Could not create showroom."),
    };
  } catch {
    return { ok: false, data: null, message: "Could not connect to the showroom API." };
  }
}
