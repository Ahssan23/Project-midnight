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

function getCarValue(car: Car, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = car[key];
    if (value !== null && value !== undefined && String(value).trim()) {
      return String(value);
    }
  }

  return fallback;
}

function getCarId(car: Car): string {
  return getCarValue(car, ["id", "_id", "CarId", "carId", "CarID"]);
}

export default async function SellerCarsPage() {
  await requireUserRole("seller", "/cars");

  const response = await getCarsForPageAction();
  const cars = response.ok ? unwrapCars(response.data) : [];

  return (
    <main className="basic-shell">
      <Link href="/showroom" className="basic-back">← Showroom</Link>
      <header className="basic-header">
        <div>
          <p className="basic-muted">Your inventory</p>
          <h1>Cars</h1>
          <p className="basic-muted">Manage the vehicles in your showroom.</p>
        </div>
        <Link href="/showroom/car/create" className="basic-primary-button">
          Add a car
        </Link>
      </header>

      {!response.ok ? (
        <section className="basic-section">
          <h2>Couldn’t load cars</h2>
          <p className="basic-muted basic-message">{response.message}</p>
        </section>
      ) : cars.length === 0 ? (
        <section className="basic-section basic-car-empty">
          <h2>No cars yet</h2>
          <p className="basic-muted">Add your first vehicle to start building your showroom inventory.</p>
          <Link href="/showroom/car/create" className="basic-primary-button">
            Create your first car
          </Link>
        </section>
      ) : (
        <section className="basic-section">
          <div className="basic-section-heading">
            <div>
              <h2>Your cars</h2>
              <p className="basic-muted">
                {cars.length} car{cars.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="basic-car-grid">
            {cars.map((car, index) => {
              const id = getCarId(car);
              const image = getCarValue(car, ["image", "imageUrl", "Image", "photo", "photoUrl"]);
              const name = getCarValue(
                car,
                ["name", "CarName", "carName", "model", "Model"],
                `Car ${index + 1}`,
              );
              const year = getCarValue(car, ["year", "Year", "modelYear"]);
              const make = getCarValue(car, ["make", "Make", "brand", "Brand"]);
              const type = getCarValue(car, ["type", "Type", "category", "Category"]);
              const price = getCarValue(
                car,
                ["price", "Price", "dailyRate", "DailyRate", "rentPerDay", "carRent"],
              );

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
                    <div className="basic-specs">
                      {[year, make, type].filter(Boolean).map((specification) => (
                        <span key={specification}>{specification}</span>
                      ))}
                    </div>
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
                return <div key={`car-${index}`}>{card}</div>;
              }

              return (
                <Link
                  key={id}
                  href={`/cars/${encodeURIComponent(id)}`}
                  className="block rounded-lg transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  {card}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
