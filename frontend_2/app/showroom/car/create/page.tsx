import Link from "next/link";
import { getShowroomForPageAction } from "@/app/showroom/[id]/action";
import { CreateCarForm } from "@/components/create-car-form";
import { requireUserRole } from "@/lib/auth";

type ApiObject = Record<string, unknown>;

function asObject(value: unknown): ApiObject | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as ApiObject;
}

function getShowroomId(value: unknown): string {
  const response = asObject(value);
  if (!response) {
    return "";
  }

  const nested = asObject(response.data);
  const showroom =
    asObject(response.showroom) ??
    asObject(nested?.showroom) ??
    nested ??
    response;
  const id = showroom.id ?? showroom._id ?? showroom.ShowroomId ?? showroom.showroomId;

  return id === undefined || id === null ? "" : String(id);
}

export default async function CreateCarPage() {
  await requireUserRole("seller", "/cars");

  const showroom = await getShowroomForPageAction();
  const showroomId = showroom.ok ? getShowroomId(showroom.data) : "";

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <Link href="/showroom/car" className="text-sm text-blue-600 hover:underline">
        ← Cars
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Add a car</h1>
      <p className="mt-2 text-slate-500">Add a vehicle to your showroom inventory.</p>
      <CreateCarForm showroomId={showroomId} />
    </main>
  );
}
