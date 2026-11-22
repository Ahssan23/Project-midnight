"use server";

import { cookies } from "next/headers";
import { getCurrentUserRole } from "@/lib/auth";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000/api";
const API_URL = `${API_BASE_URL.replace(/\/$/, "")}/booking`;

export async function getBookingsForPageAction() {
  const user = await getCurrentUserRole();
  if (user.status !== "authenticated" || user.role !== "seller") {
    return {
      ok: false,
      data: [],
      message: "Only sellers can view bookings.",
    };
  }

  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    return {
      ok: false,
      data: [],
      message: "Please log in to view bookings.",
    };
  }

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `access_token=${encodeURIComponent(token)}`,
      },
      cache: "no-store",
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const body = payload && typeof payload === "object" ? payload : {};
      return {
        ok: false,
        data: [],
        message: body.message ?? body.error ?? "Could not load bookings.",
      };
    }

    if (!Array.isArray(payload)) {
      return {
        ok: false,
        data: [],
        message: "The bookings API returned an unexpected response.",
      };
    }

    const bookings = payload.filter(
      (booking) =>
        booking !== null &&
        typeof booking === "object" &&
        !Array.isArray(booking),
    );

    return { ok: true, data: bookings, message: "" };
  } catch {
    return {
      ok: false,
      data: [],
      message: "Could not connect to the bookings API.",
    };
  }
}
