import { ShowroomTools } from "@/components/showroom-tools";
import { ShowroomDetails } from "@/components/showroom-details";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCarsForPageAction, getShowroomForPageAction } from "./[id]/action";

type ApiObject = Record<string, unknown>;

function asObject(value: unknown): ApiObject | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as ApiObject
    : null;
}

function unwrapShowroom(value: unknown): ApiObject | null {
  if (value === false || value === null || value === undefined) return null;
  const response = asObject(value);
  if (response?.showroom === false || response?.data === false) return null;
  const nested = asObject(response?.data);
  if (nested?.showroom === false) return null;
  const showroom = asObject(response?.showroom) ?? asObject(nested?.showroom) ?? nested ?? response;
  if (!showroom || Object.keys(showroom).length === 0) return null;
  return showroom;
}

function unwrapCars(value: unknown): ApiObject[] {
  if (Array.isArray(value)) return value.filter((car): car is ApiObject => asObject(car) !== null);
  const response = asObject(value);
  const nested = asObject(response?.data);
  const cars = response?.cars ?? nested?.cars ?? response?.data;
  return Array.isArray(cars) ? cars.filter((car): car is ApiObject => asObject(car) !== null) : [];
}

export default async function ShowroomPage() {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) redirect("/login");

  const response = await getShowroomForPageAction();
  const showroom = response.ok ? unwrapShowroom(response.data) : null;
  if (!showroom) return <ShowroomTools />;

  const id = showroom.id ?? showroom._id ?? showroom.ShowroomId ?? showroom.showroomId ?? "current";
  const carsResponse = await getCarsForPageAction();
  const cars = carsResponse.ok ? unwrapCars(carsResponse.data) : [];
  return <ShowroomDetails id={String(id)} showroom={showroom} cars={cars} carsError={carsResponse.ok ? "" : carsResponse.message} />;
}
