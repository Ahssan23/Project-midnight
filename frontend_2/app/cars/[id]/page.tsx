import Link from "next/link";
import { redirect } from "next/navigation";
import { CarDetails } from "@/components/car-details";
import { getCarsForPageAction, getCarsForShowroomAction } from "@/app/showroom/[id]/action";
import { getCurrentUserRole } from "@/lib/auth";

type Car = Record<string, unknown>;

function asObject(value: unknown): Car | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Car;
}

function unwrapCars(value: unknown): Car[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is Car => asObject(item) !== null);
  }

  const response = asObject(value);
  const nested = asObject(response?.data);
  const cars = response?.cars ?? nested?.cars ?? response?.data;

  if (!Array.isArray(cars)) {
    return [];
  }

  return cars.filter((item): item is Car => asObject(item) !== null);
}

function carId(car: Car): string {
  const id = car.id ?? car._id ?? car.CarId ?? car.carId ?? car.CarID;
  return id === undefined || id === null ? "" : String(id);
}

export default async function CarDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ showroomId?: string | string[] }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const queryShowroomId = Array.isArray(query.showroomId)
    ? query.showroomId[0]
    : query.showroomId;
  const session = await getCurrentUserRole();

  if (session.status === "unauthenticated") {
    redirect("/login");
  }
  if (session.status === "unavailable") {
    redirect("/login?error=role-check");
  }

  const response =
    session.role === "buyer" && queryShowroomId
      ? await getCarsForShowroomAction(queryShowroomId)
      : await getCarsForPageAction();
  const car = response.ok
    ? unwrapCars(response.data).find((item) => carId(item) === id)
    : null;
  const backHref = queryShowroomId
    ? `/showroom/${encodeURIComponent(queryShowroomId)}`
    : session.role === "seller"
      ? "/showroom"
      : "/cars";

  if (!car) {
    return (
      <main className="basic-shell">
        <Link href={backHref} className="basic-back">← Back</Link>
        <section className="basic-section" style={{ marginTop: 28 }}>
          <h1>{response.ok ? "Car not found" : "Couldn’t load this car"}</h1>
          <p className="basic-muted basic-message">
            {response.ok
              ? "This car may have been removed or the link may be incorrect."
              : response.message}
          </p>
        </section>
      </main>
    );
  }

  return (
    <CarDetails
      car={car}
      id={id}
      backHref={backHref}
      isBuyer={session.role === "buyer"}
    />
  );
}
