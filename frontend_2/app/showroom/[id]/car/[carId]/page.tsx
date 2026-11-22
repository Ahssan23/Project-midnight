import Link from "next/link";
import { redirect } from "next/navigation";
import { CarDetails } from "@/components/car-details";
import {
  getCarsForPageAction,
  getCarsForShowroomAction,
} from "@/app/showroom/[id]/action";
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

function getCarId(car: Car): string {
  const id = car.id ?? car._id ?? car.CarId ?? car.carId ?? car.CarID;
  return id === undefined || id === null ? "" : String(id);
}

function getCarShowroomId(car: Car): string {
  const relation =
    car.showroomId ??
    car.ShowroomId ??
    car.showroomID ??
    car.showroom_id ??
    car.showroom ??
    car.Showroom;

  if (relation && typeof relation === "object" && !Array.isArray(relation)) {
    const showroom = relation as Car;
    const id =
      showroom.id ??
      showroom._id ??
      showroom.ShowroomId ??
      showroom.showroomId ??
      showroom.ShowroomID ??
      showroom.showroomID;

    return id === undefined || id === null ? "" : String(id);
  }

  return relation === undefined || relation === null ? "" : String(relation);
}

function isAvailable(car: Car): boolean {
  const availability = car.available ?? car.Available ?? car.isAvailable ?? car.IsAvailable;
  if (availability === false) {
    return false;
  }

  if (typeof availability === "string") {
    const value = availability.trim().toLowerCase();
    return !["false", "unavailable", "not available", "rented", "maintenance"].includes(value);
  }

  return true;
}

export default async function ShowroomCarDetailsPage({
  params,
}: {
  params: Promise<{ id: string; carId: string }>;
}) {
  const { id: showroomId, carId } = await params;
  const session = await getCurrentUserRole();

  if (session.status === "unauthenticated") {
    redirect("/login");
  }
  if (session.status === "unavailable") {
    redirect("/login?error=role-check");
  }

  const response =
    session.role === "buyer"
      ? await getCarsForShowroomAction(showroomId)
      : await getCarsForPageAction();
  const car = response.ok
    ? unwrapCars(response.data).find((item) => {
        if (getCarId(item) !== carId) {
          return false;
        }

        const carShowroomId = getCarShowroomId(item);
        return !carShowroomId || carShowroomId === showroomId;
      })
    : null;
  const isVisible =
    car !== null && (session.role === "seller" || isAvailable(car));

  if (!response.ok || !isVisible || !car) {
    return (
      <main className="basic-shell">
        <Link href={`/showroom/${encodeURIComponent(showroomId)}`} className="basic-back">
          ← Back to showroom
        </Link>
        <section className="basic-section" style={{ marginTop: 28 }}>
          <h1>{response.ok ? "Car not found" : "Couldn’t load this car"}</h1>
          <p className="basic-muted basic-message">
            {response.ok
              ? "This car is not available in this showroom."
              : response.message}
          </p>
        </section>
      </main>
    );
  }

  return (
    <CarDetails
      car={car}
      id={carId}
      backHref={`/showroom/${encodeURIComponent(showroomId)}`}
      isBuyer={session.role === "buyer"}
    />
  );
}
