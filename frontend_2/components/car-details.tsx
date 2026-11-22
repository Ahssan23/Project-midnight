import Link from "next/link";

type Car = Record<string, unknown>;

function formatLabel(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function cleanValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(cleanValue);
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    const safeEntries = entries
      .filter(([key]) => !/(password|token|secret|authorization|card.?number|cvv|ssn)/i.test(key))
      .map(([key, nestedValue]) => [key, cleanValue(nestedValue)]);

    return Object.fromEntries(safeEntries);
  }

  return value;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "object") {
    return JSON.stringify(cleanValue(value));
  }

  return String(value);
}

export function CarDetails({
  car,
  id,
  backHref,
  isBuyer,
}: {
  car: Car;
  id: string;
  backHref: string;
  isBuyer: boolean;
}) {
  const name = String(
    car.name ?? car.CarName ?? car.carName ?? car.model ?? car.Model ?? "Car details",
  );
  const image = car.image ?? car.imageUrl ?? car.Image ?? car.photo ?? car.photoUrl;
  const imageUrl = typeof image === "string" ? image : "";
  const privateField = /(password|token|secret|authorization|card.?number|cvv|ssn|^__v$)/i;
  const details = Object.entries(car).filter(
    ([key, value]) => !privateField.test(key) && value !== null && value !== undefined,
  );

  return (
    <main className="basic-shell">
      <Link href={backHref} className="basic-back">← Back</Link>

      <header className="basic-header">
        <div>
          <p className="basic-muted">Car #{id}</p>
          <h1>{name}</h1>
        </div>
        {isBuyer && (
          <button
            className="basic-primary-button"
            disabled
            title="Booking will be available soon"
          >
            Booking coming soon
          </button>
        )}
      </header>

      {imageUrl && (
        <div
          className="basic-car-image"
          role="img"
          aria-label={name}
          style={{
            height: 320,
            borderRadius: 12,
            backgroundImage: `url("${imageUrl.replaceAll('"', "")}")`,
          }}
        />
      )}

      <section className="basic-section">
        <h2>Car information</h2>
        <div className="basic-detail-grid">
          {details.map(([key, value]) => (
            <div key={key}>
              <small>{formatLabel(key)}</small>
              <span>{formatValue(value)}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
