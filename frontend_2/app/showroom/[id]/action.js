"use server";

import { cookies } from "next/headers";
import { getCurrentUserRole } from "@/lib/auth";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000/api";

async function getFromApi(path) {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    return {
      ok: false,
      data: null,
      message: "Please log in first so the app has a token for this request.",
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL.replace(/\/$/, "")}${path}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: `access_token=${encodeURIComponent(token)}`,
        },
        cache: "no-store",
      },
    );
    const data = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      data,
      message:
        data.message ??
        data.error ??
        (response.ok ? "Request successful." : "Request failed."),
    };
  } catch {
    return {
      ok: false,
      data: null,
      message: "Could not connect to the API server.",
    };
  }
}

export async function getShowroomForPageAction(id) {
  const user = await getCurrentUserRole();
  if (user.status !== "authenticated") {
    return {
      ok: false,
      data: null,
      message: "Please log in to view showroom details.",
    };
  }

  if (!id) {
    if (user.role !== "seller") {
      return {
        ok: false,
        data: null,
        message: "A buyer must open a specific showroom.",
      };
    }

    return getFromApi("/showroom");
  }

  const showroomResponse = await getFromApi(`/showroom/${encodeURIComponent(id)}`);
  if (showroomResponse.ok || user.role === "buyer") {
    return showroomResponse;
  }

  // Older API versions only provide the signed-in seller's showroom route.
  return getFromApi("/showroom");
}

export async function getCarsForPageAction() {
  return getFromApi("/car");
}

export async function getCarsForShowroomAction(showroomId) {
  const normalizedId = String(showroomId ?? "").trim();
  if (!normalizedId) {
    return {
      ok: false,
      data: [],
      message: "A showroom ID is required to load its cars.",
    };
  }

  const query = new URLSearchParams({ showroomId: normalizedId });
  const endpoint = `${API_BASE_URL.replace(/\/$/, "")}/car?${query.toString()}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      cache: "no-store",
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const body = data && typeof data === "object" ? data : {};
      return {
        ok: false,
        data: [],
        message: body.message ?? body.error ?? "Could not load cars for this showroom.",
      };
    }

    return {
      ok: true,
      data,
      message: "",
    };
  } catch {
    return {
      ok: false,
      data: [],
      message: "Could not connect to the cars API.",
    };
  }
}
