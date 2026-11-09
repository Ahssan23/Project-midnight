"use client";

import Link from "next/link";
import { useState } from "react";

type Showroom = Record<string, unknown>;
type Car = Record<string, unknown>;

export function ShowroomDetails({ id, showroom, cars, carsError }: { id: string; showroom: Showroom; cars: Car[]; carsError: string }) {
  const [copied, setCopied] = useState(false);
  const name = showroom.ShowroomName ?? showroom.showroomName ?? showroom.name ?? "Showroom";
  const owner = showroom.OwnerName ?? showroom.OwnernName ?? showroom.ownerName ?? showroom.owner ?? "Not provided";

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">← Dashboard</Link>
      <header className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-600">Showroom #{id}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{String(name)}</h1>
          <p className="mt-2 text-slate-600">Owner: {String(owner)}</p>
        </div>
        <button onClick={copyLink} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">
          {copied ? "Link copied" : "Copy showroom link"}
        </button>
      </header>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Showroom details</h2>
        <pre className="mt-3 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-4 text-xs text-slate-700">{JSON.stringify(showroom, null, 2)}</pre>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">Cars</h2>
            <p className="mt-1 text-sm text-slate-500">{cars.length} car{cars.length === 1 ? "" : "s"}</p>
          </div>
          <button onClick={() => window.location.reload()} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50">Refresh</button>
        </div>
        {carsError ? <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{carsError}</p> : cars.length === 0 ? <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">No cars were returned for this showroom.</p> : <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {cars.map((car, index) => <article key={String(car.id ?? car._id ?? index)} className="rounded-lg border border-slate-200 p-4">
            <h3 className="font-medium">{String(car.name ?? car.CarName ?? car.carName ?? car.model ?? car.Model ?? `Car ${index + 1}`)}</h3>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap break-words text-xs text-slate-500">{JSON.stringify(car, null, 2)}</pre>
          </article>)}
        </div>}
      </section>
    </main>
  );
}
