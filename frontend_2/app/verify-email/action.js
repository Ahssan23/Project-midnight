"use server";

const API_URL = `${process.env.API_BASE_URL ?? "http://localhost:4000/api"}/verify-email`;

export async function verifyEmailAction(token) {
  if (!token) return { ok: false, message: "The verification link is missing its token." };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    
    if(Object.keys(data).length === 0){
      return {ok:false,message:"Email verification failed"}
    }
    else if(Object.keys(data).length >0){
      return {ok:true, message:"Email verification successful"}
    }
    else{
            return {ok:true, message:"Email verification failed"}

    }
  } catch {
    return { ok: false, message: "Could not connect to the email verification API." };
  }
}
