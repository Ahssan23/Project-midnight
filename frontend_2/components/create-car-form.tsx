"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createCarAction } from "@/app/showroom/car/create/action";

export function CreateCarForm({ showroomId }: { showroomId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createCarAction(new FormData(event.currentTarget));
      if (!result.ok) {
        setError(result.message);
        return;
      }

      router.push("/showroom/car");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const input = "mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100";

  return (
    <form onSubmit={submit} className="mt-8 max-w-xl space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <input type="hidden" name="showroomId" value={showroomId} />
      {!showroomId && (
        <p role="alert" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          We couldn’t find your showroom. Return to the showroom page and try again.
        </p>
      )}
      <label className="block text-sm font-medium text-slate-700">
        Car name
        <input className={input} name="carName" autoComplete="off" placeholder="For example: Toyota Corolla" required disabled={!showroomId || loading} />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Rent per day
        <input className={input} name="carRent" type="number" min="0" step="any" inputMode="decimal" placeholder="0" required disabled={!showroomId || loading} />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Availability
        <select className={input} name="available" defaultValue="true" required disabled={!showroomId || loading}>
          <option value="true">Available</option>
          <option value="false">Not available</option>
        </select>
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading || !showroomId}
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Adding car…" : "Add car"}
      </button>
    </form>
  );
}
