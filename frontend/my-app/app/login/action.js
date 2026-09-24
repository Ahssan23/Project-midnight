"use server";

import { cookies } from "next/headers";

export async function login(previousState, formData) {
  const BACKEND_URL = "http://localhost:4000";
  const email = formData.get("email");
  const password = formData.get("password");

  const res = await fetch(`${BACKEND_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  const data = await res.json();

  if (data.status == 200) {
    const cookieStore = await cookies();

    cookieStore.set("access_token", data.jwt_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  return data;
  // console.log(res,' this is response dude nigger killer');
}
