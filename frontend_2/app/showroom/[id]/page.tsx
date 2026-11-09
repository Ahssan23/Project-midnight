import Link from "next/link";
import { getCarsForPageAction, getShowroomForPageAction } from "./action";
import { ShowroomDetails } from "@/components/showroom-details";

type ApiObject = Record<string, unknown>;

function asObject(value: unknown): ApiObject | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as ApiObject
    : null;
}

function unwrapShowroom(data: unknown): ApiObject | null {
  const response = asObject(data);
  const nested = asObject(response?.data);
  return asObject(response?.showroom) ?? asObject(nested?.showroom) ?? nested ?? response;
}

function unwrapCars(data: unknown): ApiObject[] {
  if (Array.isArray(data)) return data.filter((car): car is ApiObject => asObject(car) !== null);
  const response = asObject(data);
  const nested = asObject(response?.data);
  const cars = response?.cars ?? nested?.cars ?? response?.data;
  return Array.isArray(cars) ? cars.filter((car): car is ApiObject => asObject(car) !== null) : [];
}

export default async function ShowroomByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [showroomResponse, carsResponse] = await Promise.all([
    getShowroomForPageAction(),
    getCarsForPageAction(),
  ]);
  const showroom = showroomResponse.ok ? unwrapShowroom(showroomResponse.data) : null;
  const returnedId = showroom?.id ?? showroom?._id ?? showroom?.ShowroomId ?? showroom?.showroomId;

  if (showroom && returnedId !== undefined && String(returnedId) !== id) {
    return (
      <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
        <Link href="/showroom" className="text-sm text-blue-600 hover:underline">← Showrooms</Link>
        <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          <h1 className="text-xl font-semibold">This link points to showroom {id}</h1>
          <p className="mt-2 text-sm">Your saved token returned showroom {returnedId}. The current API GET route returns the token owner’s showroom, so it cannot load another showroom by ID yet.</p>
        </section>
      </main>
    );
  }

  if (!showroom) {
    return (
      <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
        <Link href="/showroom" className="text-sm text-blue-600 hover:underline">← Showrooms</Link>
        <section className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
          <h1 className="text-xl font-semibold">Could not load showroom {id}</h1>
          <p className="mt-2 text-sm">{showroomResponse.message}</p>
        </section>
      </main>
    );
  }

  const cars = carsResponse.ok ? unwrapCars(carsResponse.data) : [];
  return <ShowroomDetails id={id} showroom={showroom} cars={cars} carsError={carsResponse.ok ? "" : carsResponse.message} />;
}
