"use server";

import { cookies } from "next/headers";
import { getCurrentUserRole } from "@/lib/auth";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000/api";
const API_URL = `${API_BASE_URL.replace(/\/$/, "")}/showroom`;

export async function createShowroomAction(formData) {
  const user = await getCurrentUserRole();
  if (user.status !== "authenticated" || user.role !== "seller") {
    return {
      ok: false,
      data: null,
      message: "Only sellers can create a showroom.",
    };
  }

  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    return {
      ok: false,
      data: null,
      message: "Please log in before creating a showroom.",
    };
  }

  const payload = {
    ShowroomName: String(formData.get("ShowroomName") ?? "").trim(),
    ownerName: String(formData.get("OwnernName") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Cookie: `access_token=${encodeURIComponent(token)}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    const cookieToken = (response.headers.get("set-cookie") ?? "").match(
      /(?:^|,\s*)accesstoken=([^;,\s]+)/i,
    )?.[1];
    const newToken =
      data.token ??
      data.accessToken ??
      data.data?.token ??
      (cookieToken ? decodeURIComponent(cookieToken) : undefined);

    if (newToken && response.ok) {
      (await cookies()).set("access_token", newToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
    }

    return {
      ok: response.ok,
      data,
      message:
        data.message ??
        data.error ??
        (response.ok ? "Showroom created." : "Could not create showroom."),
    };
  } catch {
    return {
      ok: false,
      data: null,
      message: "Could not connect to the showroom API.",
    };
  }
}
