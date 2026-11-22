import Link from "next/link";
import { getCarsForPageAction } from "@/app/showroom/[id]/action";
import { requireUserRole } from "@/lib/auth";

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

function carValue(car: Car, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = car[key];
    if (value !== null && value !== undefined && String(value).trim()) {
      return String(value);
    }
  }

  return fallback;
}

function carId(car: Car): string {
  return carValue(car, ["id", "_id", "CarId", "carId", "CarID"]);
}

function carShowroomId(car: Car): string {
  const relation =
    car.showroomId ??
    car.ShowroomId ??
    car.showroomID ??
    car.showroom_id ??
    car.showroom ??
    car.Showroom;

  if (relation && typeof relation === "object" && !Array.isArray(relation)) {
    return carValue(
      relation as Car,
      ["id", "_id", "ShowroomId", "showroomId", "ShowroomID", "showroomID"],
    );
  }

  return relation === undefined || relation === null ? "" : String(relation);
}

export default async function BrowseCarsPage() {
  await requireUserRole("buyer", "/showroom");

  const response = await getCarsForPageAction();
  const cars = response.ok ? unwrapCars(response.data) : [];

  return (
    <main className="basic-shell">
      <header className="basic-header">
        <div>
          <p className="basic-muted">Find your next rental</p>
          <h1>Available cars</h1>
          {response.ok && (
            <p className="basic-muted">
              {cars.length} car{cars.length === 1 ? "" : "s"} to explore
            </p>
          )}
        </div>
      </header>

      {!response.ok ? (
        <section className="basic-section">
          <h2>Couldn’t load cars</h2>
          <p className="basic-muted basic-message">{response.message}</p>
        </section>
      ) : cars.length === 0 ? (
        <section className="basic-section basic-car-empty">
          <h2>No cars available</h2>
          <p className="basic-muted">Check back later for cars available to rent.</p>
        </section>
      ) : (
        <section className="basic-car-grid" aria-label="Available cars">
          {cars.map((car, index) => {
            const id = carId(car);
            const showroomId = carShowroomId(car);
            const name = carValue(
              car,
              ["name", "CarName", "carName", "model", "Model"],
              `Car ${index + 1}`,
            );
            const image = carValue(car, ["image", "imageUrl", "Image", "photo", "photoUrl"]);
            const price = carValue(
              car,
              ["price", "Price", "dailyRate", "DailyRate", "rentPerDay", "carRent"],
            );
            const make = carValue(car, ["make", "Make", "brand", "Brand"]);
            const year = carValue(car, ["year", "Year", "modelYear"]);

            const card = (
              <article className="basic-car-card">
                {image && (
                  <div
                    className="basic-car-image"
                    role="img"
                    aria-label={name}
                    style={{ backgroundImage: `url("${image.replaceAll('"', "")}")` }}
                  />
                )}
                <div className="basic-car-info">
                  <h2>{name}</h2>
                  {(make || year) && (
                    <div className="basic-specs">
                      {make && <span>{make}</span>}
                      {year && <span>{year}</span>}
                    </div>
                  )}
                  {price && <p className="basic-muted">{price} per day</p>}
                  {id && (
                    <span className="mt-3 inline-block text-sm font-medium text-blue-600">
                      View car details →
                    </span>
                  )}
                </div>
              </article>
            );

            if (!id) {
              return (
                <div key={`car-${index}`} className="space-y-2">
                  {card}
                  {showroomId && (
                    <Link
                      href={`/showroom/${encodeURIComponent(showroomId)}`}
                      className="inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                      Visit this showroom →
                    </Link>
                  )}
                </div>
              );
            }

            return (
              <div key={id} className="space-y-2">
                <Link
                  href={showroomId
                    ? `/showroom/${encodeURIComponent(showroomId)}/car/${encodeURIComponent(id)}`
                    : `/cars/${encodeURIComponent(id)}`}
                  className={[
                    "block rounded-lg transition",
                    "hover:-translate-y-0.5 hover:shadow-md",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                  ].join(" ")}
                >
                  {card}
                </Link>
                {showroomId && (
                  <Link
                    href={`/showroom/${encodeURIComponent(showroomId)}`}
                    className="inline-block text-sm font-medium text-blue-600 hover:underline"
                  >
                    Visit this showroom →
                  </Link>
                )}
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}
