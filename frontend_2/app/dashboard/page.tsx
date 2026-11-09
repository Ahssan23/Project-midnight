import Link from "next/link";

export default function DashboardPage() {
  return <main className="mx-auto min-h-screen max-w-5xl px-4 py-12">
    <p className="text-sm font-medium text-blue-600">Rental Management System</p>
    <h1 className="mt-2 text-3xl font-semibold tracking-tight">Dashboard</h1>
    <p className="mt-2 text-slate-500">Create your showroom, then manage its cars from the showroom page.</p>
    <Link href="/showroom" className="mt-8 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Create showroom</Link>
    <Link href="/login" className="mt-8 inline-block text-sm text-blue-600 hover:underline">Go to login</Link>
  </main>;
}
