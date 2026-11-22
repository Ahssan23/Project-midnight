"use client";

import Link from "next/link";
import { useState } from "react";

type Item = Record<string, unknown>;

function getValue(item: Item, keys: string[], fallback = "—"): string {
  for (const key of keys) {
    const value = item[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value);
    }
  }

  return fallback;
}

function titleCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function carDetails(car: Item) {
  const fields = [
    ["year", ["year", "Year", "modelYear"]],
    ["make", ["make", "Make", "brand", "Brand"]],
    ["type", ["type", "Type", "category", "Category"]],
    ["transmission", ["transmission", "Transmission"]],
    ["seats", ["seats", "Seats"]],
  ] as const;

  return fields
    .map(([label, keys]) => [label, getValue(car, [...keys], "")] as const)
    .filter(([, value]) => value);
}

function carDetailsHref(carId: string, showroomId: string): string {
  return `/showroom/${encodeURIComponent(showroomId)}/car/${encodeURIComponent(carId)}`;
}

export function ShowroomDetails({
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
  const [copied, setCopied] = useState(false);
  const name = getValue(showroom, ["ShowroomName", "showroomName", "name"], "My showroom");
  const owner = getValue(
    showroom,
    ["OwnerName", "OwnernName", "ownerName", "owner"],
    "Not provided",
  );
  const hiddenShowroomFields = new Set([
    "id",
    "_id",
    "ShowroomId",
    "showroomId",
    "ShowroomName",
    "showroomName",
    "name",
    "OwnerName",
    "OwnernName",
    "ownerName",
    "owner",
    "password",
    "token",
  ]);
  const details = Object.entries(showroom).filter(
    ([key, value]) =>
      !hiddenShowroomFields.has(key) &&
      ["string", "number", "boolean"].includes(typeof value) &&
      String(value).trim(),
  );

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="basic-shell">
      <Link href="/showroom" className="basic-back">← Showroom</Link>

      <header className="basic-header">
        <div>
          <p className="basic-muted">Showroom #{id}</p>
          <h1>{name}</h1>
          <p className="basic-muted">Owner: {owner}</p>
        </div>
        <div className="basic-actions">
          <Link href="/booking" className="basic-primary-button">Bookings</Link>
          <button onClick={copyLink} className="basic-button">
            {copied ? "Link copied" : "Copy showroom link"}
          </button>
        </div>
      </header>

      <section className="basic-section">
        <div className="basic-section-heading">
          <div>
            <h2>Cars</h2>
            <p className="basic-muted">
              {cars.length} car{cars.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="basic-actions">
            <Link href="/showroom/car" className="basic-back">Manage cars</Link>
            <Link href="/showroom/car/create" className="basic-primary-button">Add a car</Link>
            <button onClick={() => window.location.reload()} className="basic-button">
              Refresh
            </button>
          </div>
        </div>

        {carsError ? (
          <div className="basic-error">{carsError}</div>
        ) : cars.length === 0 ? (
          <p className="basic-empty">
            No cars have been added to this showroom yet. Add your first car to get started.
          </p>
        ) : (
          <div className="basic-car-grid">
            {cars.map((car, index) => {
              const carName = getValue(
                car,
                ["name", "CarName", "carName", "model", "Model"],
                `Vehicle ${index + 1}`,
              );
              const carId = getValue(car, ["id", "_id", "CarId", "carId", "CarID"], "");
              const image = getValue(
                car,
                ["image", "imageUrl", "Image", "photo", "photoUrl", "url"],
                "",
              );
              const price = getValue(
                car,
                ["price", "Price", "dailyRate", "DailyRate", "rentPerDay", "carRent"],
                "",
              );
              const specifications = carDetails(car);

              const card = (
                <article className="basic-car-card">
                  {image && (
                    <div
                      className="basic-car-image"
                      role="img"
                      aria-label={carName}
                      style={{ backgroundImage: `url("${image.replaceAll('"', "")}")` }}
                    />
                  )}
                  <div className="basic-car-info">
                    <h3>{carName}</h3>
                    {specifications.length > 0 && (
                      <div className="basic-specs">
                        {specifications.slice(0, 4).map(([label, value]) => (
                          <span key={label}>{titleCase(label)}: {value}</span>
                        ))}
                      </div>
                    )}
                    {price && <p className="basic-muted">{price} per day</p>}
                    {carId && (
                      <span className="mt-3 inline-block text-sm font-medium text-blue-600">
                        View car details →
                      </span>
                    )}
                  </div>
                </article>
              );

              if (!carId) {
                return <div key={`car-${index}`}>{card}</div>;
              }

              return (
                <Link
                  key={carId}
                  href={carDetailsHref(carId, id)}
                  className="block rounded-lg transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  {card}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {details.length > 0 && (
        <section className="basic-section">
          <h2>Showroom information</h2>
          <div className="basic-detail-grid">
            {details.map(([key, value]) => (
              <div key={key}>
                <small>{titleCase(key)}</small>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
