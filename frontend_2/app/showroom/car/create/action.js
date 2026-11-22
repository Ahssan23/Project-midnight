"use server";

import { cookies } from "next/headers";
import { getCurrentUserRole } from "@/lib/auth";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000/api";
const API_URL = `${API_BASE_URL.replace(/\/$/, "")}/car`;

export async function createCarAction(formData) {
  const user = await getCurrentUserRole();
  if (user.status !== "authenticated" || user.role !== "seller") {
    return { ok: false, message: "Only sellers can add cars." };
  }

  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    return { ok: false, message: "Please log in before adding a car." };
  }

  const carName = String(formData.get("carName") ?? "").trim();
  const rentText = String(formData.get("carRent") ?? "").trim();
  const showroomId = String(formData.get("showroomId") ?? "").trim();
  const availableText = String(formData.get("available") ?? "");
  const carRent = Number(rentText);

  const hasValidRent =
    rentText !== "" && Number.isFinite(carRent) && carRent >= 0;
  const hasValidAvailability = ["true", "false"].includes(availableText);

  if (!carName || !showroomId || !hasValidRent || !hasValidAvailability) {
    return {
      ok: false,
      message: "Enter a car name, a valid rent, a showroom ID, and an availability status.",
    };
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Cookie: `access_token=${encodeURIComponent(token)}`,
      },
      body: JSON.stringify({
        carName,
        carRent,
        showroomId,
        available: availableText === "true",
      }),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      message:
        data.message ??
        data.error ??
        (response.ok ? "Car added." : "Could not add this car."),
    };
  } catch {
    return { ok: false, message: "Could not connect to the car API." };
  }
}
