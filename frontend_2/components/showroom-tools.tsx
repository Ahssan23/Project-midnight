"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createShowroomAction } from "@/app/showroom/action";

export function ShowroomTools() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const result = await createShowroomAction(new FormData(event.currentTarget));
      if (!result.ok) {
        setError(result.message);
        return;
      }

      router.refresh();
      setMessage(result.message);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const input = "mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <div className="mb-6"><a href="/" className="text-sm text-blue-600 hover:underline">← Home</a></div>
      <h1 className="text-3xl font-semibold tracking-tight">Create a showroom</h1>
      <p className="mt-2 text-slate-500">After creation, the showroom ID opens its detail page with its cars.</p>
      <form onSubmit={create} className="mt-8 max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium">Showroom name<input className={input} name="ShowroomName" required /></label>
        <label className="block text-sm font-medium">Owner name<input className={input} name="OwnernName" required /></label>
        <label className="block text-sm font-medium">Password<input className={input} name="password" type="password" required /></label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        {message && <p role="status" className="text-sm text-amber-800">{message}</p>}
        <button disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{loading ? "Creating…" : "Create showroom"}</button>
      </form>
    </main>
  );
}
