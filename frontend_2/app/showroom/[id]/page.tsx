import Link from "next/link";
import { redirect } from "next/navigation";
import { ShowroomDetails } from "@/components/showroom-details";
import { PublicShowroom } from "@/components/public-showroom";
import { getCurrentUserRole } from "@/lib/auth";
import {
  getCarsForPageAction,
  getCarsForShowroomAction,
  getShowroomForPageAction,
} from "./action";

type ApiObject = Record<string, unknown>;

function asObject(value: unknown): ApiObject | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as ApiObject;
}

function unwrapShowroom(value: unknown): ApiObject | null {
  if (value === false || value === null || value === undefined) {
    return null;
  }

  const response = asObject(value);
  if (response?.showroom === false || response?.data === false) {
    return null;
  }

  const nested = asObject(response?.data);
  if (nested?.showroom === false) {
    return null;
  }

  const showroom =
    asObject(response?.showroom) ??
    asObject(nested?.showroom) ??
    nested ??
    response;

  return showroom && Object.keys(showroom).length > 0 ? showroom : null;
}

function unwrapCars(value: unknown): ApiObject[] {
  if (Array.isArray(value)) {
    return value.filter((car): car is ApiObject => asObject(car) !== null);
  }

  const response = asObject(value);
  const nested = asObject(response?.data);
  const showroom = asObject(response?.showroom) ?? asObject(nested?.showroom);
  const nestedShowroom = asObject(nested?.data);
  const cars =
    response?.cars ??
    nested?.cars ??
    showroom?.cars ??
    nestedShowroom?.cars ??
    response?.data;

  if (!Array.isArray(cars)) {
    return [];
  }

  return cars.filter((car): car is ApiObject => asObject(car) !== null);
}

function getCarShowroomId(car: ApiObject): string {
  const relation =
    car.showroomId ??
    car.ShowroomId ??
    car.showroomID ??
    car.showroom_id ??
    car.showroom ??
    car.Showroom;

  if (relation && typeof relation === "object" && !Array.isArray(relation)) {
    const showroom = relation as ApiObject;
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

function isCarAvailable(car: ApiObject): boolean {
  const availability = car.available ?? car.Available ?? car.isAvailable ?? car.IsAvailable;
  if (availability === false) {
    return false;
  }

  if (typeof availability === "string") {
    const normalizedAvailability = availability.trim().toLowerCase();
    if (["false", "unavailable", "not available", "rented", "maintenance"].includes(normalizedAvailability)) {
      return false;
    }
  }

  return true;
}

function showroomIdentifier(showroom: ApiObject, fallback: string): string {
  const value =
    showroom.id ??
    showroom._id ??
    showroom.ShowroomId ??
    showroom.showroomId ??
    fallback;

  return String(value);
}

function NotFound({
  message,
  backHref,
}: {
  message: string;
  backHref: string;
}) {
  return (
    <main className="basic-shell">
      <Link href={backHref} className="basic-back">← Back</Link>
      <section className="basic-section" style={{ marginTop: 28 }}>
        <h1>Showroom not found</h1>
        <p className="basic-muted basic-message">{message}</p>
        <Link href={backHref} className="basic-back">Go back</Link>
      </section>
    </main>
  );
}

export default async function ShowroomByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUserRole();
  if (user.status === "unauthenticated") {
    redirect("/login");
  }
  if (user.status === "unavailable") {
    redirect("/login?error=role-check");
  }

  const backHref = user.role === "seller" ? "/showroom" : "/cars";

  const response = await getShowroomForPageAction(id);
  const showroom = response.ok ? unwrapShowroom(response.data) : null;

  if (!showroom) {
    const message = response.ok
      ? `We couldn’t find showroom ${id}. It may have been removed or the link may be incorrect.`
      : response.message;
    return <NotFound message={message} backHref={backHref} />;
  }

  const showroomId = showroomIdentifier(showroom, id);
  if (showroomId !== id) {
    return (
      <NotFound
        message="The API returned a different showroom. Check the link and try again."
        backHref={backHref}
      />
    );
  }

  const carsResponse =
    user.role === "buyer"
      ? await getCarsForShowroomAction(showroomId)
      : await getCarsForPageAction();
  const carsFromShowroom = unwrapCars(response.data);
  const carsFromList = carsResponse.ok ? unwrapCars(carsResponse.data) : [];
  const sourceCars = carsFromShowroom.length > 0 ? carsFromShowroom : carsFromList;
  const cars =
    user.role === "buyer"
      ? sourceCars.filter(isCarAvailable)
      : sourceCars.filter((car) => {
          const carShowroomId = getCarShowroomId(car);
          return carShowroomId === showroomId || !carShowroomId;
        });
  let carsError = "";

  if (sourceCars.length === 0 && !carsResponse.ok && carsFromShowroom.length === 0) {
    carsError = carsResponse.message;
  }

  if (user.role === "seller") {
    return (
      <ShowroomDetails
        id={showroomId}
        showroom={showroom}
        cars={cars}
        carsError={carsError}
      />
    );
  }

  return (
    <PublicShowroom
      id={showroomId}
      showroom={showroom}
      cars={cars}
      carsError={carsError}
    />
  );
}
