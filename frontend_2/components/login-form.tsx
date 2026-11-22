"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/login/action";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginAction(new FormData(event.currentTarget));
      if (!result.ok) {
        setError(result.message);
        return;
      }

      const destination = result.role === "seller" ? "/showroom" : "/cars";
      router.replace(destination);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <form onSubmit={submit} className="space-y-5">
      <label className="block text-sm font-medium text-slate-700">
        Username or email
        <input
          className={inputClassName}
          name="usernameOrEmail"
          autoComplete="username"
          placeholder="Your username or email"
          required
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Password
        <input
          className={inputClassName}
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

      <button
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Please wait…" : "Log in"}
      </button>
    </form>
  );
}
