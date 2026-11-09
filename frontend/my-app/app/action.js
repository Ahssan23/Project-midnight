"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";



export async function checkCookies(){

  const cookieChecker = await cookies();
  const token = cookieChecker.get("access_token");
  try{
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token.value, secret ,{
      algorithms:['HS256']
    })
    console.log(true)
    return true;
  }catch{
    console.log(false)
    return false;
  }
}
checkCookies()

export async function createShowroom() {
  redirect("/dashboard");
}