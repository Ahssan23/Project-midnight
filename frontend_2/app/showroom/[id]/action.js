"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000/api";

async function getFromApi(path) {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    return { ok: false, data: null, message: "Please log in first so the app has a token for this request." };
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `access_token=${encodeURIComponent(token)}`,
      },
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    return {
      ok: response.ok,
      data,
      message: data.message ?? data.error ?? (response.ok ? "Request successful." : "Request failed."),
    };
  } catch {
    return { ok: false, data: null, message: "Could not connect to the API server." };
  }
}

export async function getShowroomForPageAction() {
  return getFromApi("/showroom");
}

export async function getCarsForPageAction() {
  return getFromApi("/car");
}
