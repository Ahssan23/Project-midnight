"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { passResetAction } from "@/app/pass-reset/action";

export function PassResetForm({ token }: { token: string }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const result = await passResetAction(token, new FormData(event.currentTarget));
      if (result.ok) {
        setMessage(result.message);
        setSucceeded(true);
      } else {
        setError(result.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const input = "mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <form onSubmit={submit} className="space-y-5">
      {!token && <p role="alert" className="text-sm text-red-700">This password reset link is missing its token.</p>}
      <label className="block text-sm font-medium text-slate-700">
        New password
        <input
          className={input}
          name="password"
          type="password"
          autoComplete="new-password"
          required
          disabled={succeeded || !token}
        />
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="text-sm text-green-700">{message}</p>}
      {succeeded ? (
        <Link href="/login" className="block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700">
          Continue to login
        </Link>
      ) : (
        <button
          disabled={loading || !token}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Updating…" : "Reset password"}
        </button>
      )}
    </form>
  );
}
