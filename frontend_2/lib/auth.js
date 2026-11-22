import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000/api";

function parseRoleValue(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();
    if (normalizedValue === "seller" || normalizedValue === "true") {
      
      return true;
    }
    if (normalizedValue === "buyer" || normalizedValue === "false") {
      return false;
    }
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const possibleRoleValues = [
    value.isSeller,
    value.seller,
    value.role,
    value.data,
    value.user,
  ];

  for (const possibleRoleValue of possibleRoleValues) {
    const parsedValue = parseRoleValue(possibleRoleValue);
    if (parsedValue !== null) {
      return parsedValue;
    }
  }

  return null;
}

export async function verifySellerToken(token) {
  if (!token) {
    return { status: "unauthenticated", role: null };
  }
  
  try {
    const endpoint = `${API_BASE_URL.replace(/\/$/, "")}/auth/verify-role`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: `access_token=${encodeURIComponent(token)}`,
      },
      cache: "no-store",
    });
    
    if (response.status === 401 || response.status === 403) {
      return { status: "unauthenticated", role: null };
    }
    if (!response.ok) {
      return { status: "unavailable", role: null };
    }
    
    const payload = await response.json().catch(() => null);
    const isSeller = parseRoleValue(payload);
    if (isSeller === null) {
      console.log('0000-90-99-0')
      return { status: "unavailable", role: null };
    }
    
    return {
      status: "authenticated",
      role: isSeller ? "seller" : "buyer",
    };
  } catch (err){
    return { status: "unavailable", role: null };
  }
}

export async function getCurrentUserRole() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  return verifySellerToken(token);
}

export async function requireUserRole(role, otherRoleDestination = "/cars") {
  const result = await getCurrentUserRole();

  if (result.status === "unauthenticated") {
    redirect("/login");
  }
  if (result.status === "unavailable") {
    redirect("/login?error=role-check");
  }
  if (result.role !== role) {
    redirect(otherRoleDestination);
  }

  return result.role;
}
