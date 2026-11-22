import Link from "next/link";
import { getBookingsForPageAction } from "./action";
import { requireUserRole } from "@/lib/auth";

type Booking = Record<string, unknown>;

function formatLabel(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function safeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(safeValue);
  }

  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    const safeEntries = entries
      .filter(([key]) => !/(password|token|secret|authorization|card.?number|cvv|ssn)/i.test(key))
      .map(([key, nestedValue]) => [key, safeValue(nestedValue)]);

    return Object.fromEntries(safeEntries);
  }

  return value;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "object") {
    return JSON.stringify(safeValue(value));
  }

  return String(value);
}

function getBookingKey(booking: Booking, index: number): string {
  const id = booking.id ?? booking._id ?? booking.BookingId ?? booking.bookingId;
  return id === undefined || id === null ? `booking-${index}` : String(id);
}

function getBookingTitle(booking: Booking, index: number): string {
  const title =
    booking.carName ??
    booking.CarName ??
    booking.vehicleName ??
    booking.customerName ??
    booking.name;

  return title === undefined || title === null
    ? `Booking ${index + 1}`
    : String(title);
}

function isPrivateField(key: string): boolean {
  return /(password|token|secret|authorization|card.?number|cvv|ssn)/i.test(key);
}

export default async function BookingsPage() {
  await requireUserRole("seller", "/cars");
  const result = await getBookingsForPageAction();

  return (
    <main className="basic-shell">
      <Link href="/showroom" className="basic-back">
        ← Showroom
      </Link>

      <header className="basic-header">
        <div>
          <p className="basic-muted">Rental activity</p>
          <h1>Bookings</h1>
          {result.ok && (
            <p className="basic-muted">
              {result.data.length} booking{result.data.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </header>

      {!result.ok ? (
        <section className="basic-section">
          <h2>Couldn’t load bookings</h2>
          <p className="basic-muted basic-message">{result.message}</p>
        </section>
      ) : result.data.length === 0 ? (
        <section className="basic-section basic-car-empty">
          <h2>No bookings yet</h2>
          <p className="basic-muted">Bookings for your cars will appear here.</p>
        </section>
      ) : (
        <section className="basic-bookings-list" aria-label="Bookings">
          {result.data.map((booking: Booking, index: number) => {
            const fields = Object.entries(booking).filter(
              ([key, value]) => !isPrivateField(key) && value !== undefined,
            );

            return (
              <article className="basic-section" key={getBookingKey(booking, index)}>
                <div className="basic-section-heading">
                  <div>
                    <h2>{getBookingTitle(booking, index)}</h2>
                    {booking.status !== undefined && (
                      <p className="basic-muted">
                        Status: {formatValue(booking.status)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="basic-detail-grid">
                  {fields.map(([key, value]) => (
                    <div key={key}>
                      <small>{formatLabel(key)}</small>
                      <span>{formatValue(value)}</span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
