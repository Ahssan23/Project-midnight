import Link from "next/link";

type Item = Record<string, unknown>;

function getValue(item: Item, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = item[key];
    if (value !== null && value !== undefined && String(value).trim()) {
      return String(value);
    }
  }

  return fallback;
}

function getCarId(car: Item): string {
  return getValue(car, ["id", "_id", "CarId", "carId", "CarID"]);
}

function carDetailsHref(carId: string, showroomId: string): string {
  return `/showroom/${encodeURIComponent(showroomId)}/car/${encodeURIComponent(carId)}`;
}

function carCard(car: Item, index: number, showroomId: string) {
  const id = getCarId(car);
  const name = getValue(
    car,
    ["name", "CarName", "carName", "model", "Model"],
    `Car ${index + 1}`,
  );
  const image = getValue(car, ["image", "imageUrl", "Image", "photo", "photoUrl"]);
  const price = getValue(
    car,
    ["price", "Price", "dailyRate", "DailyRate", "rentPerDay", "carRent"],
  );
  const make = getValue(car, ["make", "Make", "brand", "Brand"]);
  const year = getValue(car, ["year", "Year", "modelYear"]);
  const carContent = (
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
    return <div key={`car-${index}`}>{carContent}</div>;
  }

  return (
    <Link
      key={id}
      href={carDetailsHref(id, showroomId)}
      className="block rounded-lg transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      {carContent}
    </Link>
  );
}

export function PublicShowroom({
  id,
  showroom,
  cars,
  carsError,
}: {
  id: string;
  showroom: Item;
  cars: Item[];
  carsError: string;
}) {
  const name = getValue(
    showroom,
    ["ShowroomName", "showroomName", "name"],
    `Showroom ${id}`,
  );
  const description = getValue(showroom, ["description", "Description", "about", "About"]);
  const location = getValue(
    showroom,
    ["location", "Location", "city", "City"],
  );

  return (
    <main className="basic-shell">
      <Link href="/cars" className="basic-back">← Browse cars</Link>

      <header className="basic-header">
        <div>
          <p className="basic-muted">Showroom #{id}</p>
          <h1>{name}</h1>
          {location && <p className="basic-muted">{location}</p>}
          {description && <p className="mt-3 max-w-2xl text-sm text-slate-600">{description}</p>}
        </div>
      </header>

      <section className="basic-section">
        <div className="basic-section-heading">
          <div>
            <h2>Available cars</h2>
            <p className="basic-muted">
              {cars.length} car{cars.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {carsError ? (
          <div className="basic-error">{carsError}</div>
        ) : cars.length === 0 ? (
          <p className="basic-empty">This showroom has no cars available right now.</p>
        ) : (
          <div className="basic-car-grid">
            {cars.map((car, index) => carCard(car, index, id))}
          </div>
        )}
      </section>
    </main>
  );
}
