"use client";

import { useState, type FormEvent } from "react";
import { signupAction } from "@/app/signup/action";

export function SignupForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(""); setError(""); setLoading(true);
    try {
      const result = await signupAction(new FormData(event.currentTarget));
      result.ok ? setMessage(result.message) : setError(result.message);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }
  const input = "mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
  return <form onSubmit={submit} className="space-y-4">
    <label className="block text-sm font-medium text-slate-700">Name<input className={input} name="name" autoComplete="name" required /></label>
    <label className="block text-sm font-medium text-slate-700">Email<input className={input} name="email" type="email" autoComplete="email" required /></label>
    <label className="block text-sm font-medium text-slate-700">Phone<input className={input} name="phone" type="tel" autoComplete="tel" required /></label>
    <label className="block text-sm font-medium text-slate-700">Role<input className={input} name="role" placeholder="For example: owner" required /></label>
    <label className="block text-sm font-medium text-slate-700">Password<input className={input} name="password" type="password" autoComplete="new-password" required /></label>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}{message && <p role="status" className="text-sm text-green-700">{message}</p>}
    <button disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{loading ? "Please wait…" : "Create account"}</button>
  </form>;
}
