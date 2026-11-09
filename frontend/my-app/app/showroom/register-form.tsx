"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterShowroom, GetShowroom, getCars } from "./action";

export default function ShowroomForm() {
  const router = useRouter();

  const [showroom, setShowroom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [carsLoading, setCarsLoading] = useState(false);
  const [hasCars, setHasCars] = useState<boolean | null>(null);

  const [state, action, pending] = useActionState(RegisterShowroom, null);

  useEffect(() => {
    async function fetchShowroom() {
      try {
        const data = await GetShowroom();
        setShowroom(data);

        if (data) {
          setCarsLoading(true);

          const cars = await getCars();

          if (Array.isArray(cars)) {
            setHasCars(cars.length > 0);
          } else {
            setHasCars(cars !== false && cars !== null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch showroom or cars:", error);
      } finally {
        setLoading(false);
        setCarsLoading(false);
      }
    }

    fetchShowroom();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading your showroom...</p>
      </div>
    );
  }

  // Showroom exists
  if (showroom) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="mx-auto max-w-6xl">

          <div className="mb-10">
            <p className="text-sm font-medium text-gray-500">
              YOUR SHOWROOM
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {showroom.ShowroomName}
            </h1>

            <p className="mt-2 text-gray-500">
              Welcome back, {showroom.OwnerName}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Showroom</p>
              <h2 className="mt-3 text-xl font-semibold text-gray-900">
                {showroom.ShowroomName}
              </h2>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Owner</p>
              <h2 className="mt-3 text-xl font-semibold text-gray-900">
                {showroom.OwnerName}
              </h2>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Status</p>
              <h2 className="mt-3 text-xl font-semibold text-green-600">
                Active
              </h2>
            </div>

          </div>

          <div className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">

            <h2 className="text-xl font-semibold text-gray-900">
              Manage your showroom
            </h2>

            <p className="mt-2 text-gray-500">
              Your showroom is ready. You can start managing your cars and inventory.
            </p>

            {carsLoading ? (
              <p className="mt-6 text-sm text-gray-500">
                Checking your inventory...
              </p>
            ) : hasCars === false ? (
              <div className="mt-6">
                <p className="mb-4 text-gray-600">
                  You haven't added any cars to your showroom yet.
                </p>

                <button
                  onClick={() => router.push("/dashboard/add-car")}
                  className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
                >
                  Add Car
                </button>
              </div>
            ) : hasCars === true ? (
              <button
                onClick={() => router.push("/dashboard/cars")}
                className="mt-6 rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
              >
                Manage Cars
              </button>
            ) : null}

          </div>

        </div>
      </main>
    );
  }

  // No showroom: Registration form
  return (
    <form
      action={action}
      className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6"
    >
      <h1 className="mb-2 text-3xl font-bold">
        Create your showroom
      </h1>

      <input
        type="text"
        name="ownerName"
        placeholder="Owner name"
        required
        className="rounded-lg border px-4 py-3 outline-none"
      />

      <input
        type="text"
        name="showroomName"
        placeholder="Showroom name"
        required
        className="rounded-lg border px-4 py-3 outline-none"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="rounded-lg border px-4 py-3 outline-none"
      />

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-black px-4 py-3 font-medium text-white disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create showroom"}
      </button>

      {state?.message && (
        <p className="text-red-500">{state.message}</p>
      )}
    </form>
  );
}