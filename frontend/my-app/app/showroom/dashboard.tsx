interface Car {
    id: number;
    carName: string;
    carRent: number;
    available: boolean;
}

interface DashboardPageProps {
    cars: Car[];
}

export default function DashboardPage({ cars }: DashboardPageProps) {
    return (
        <main className="min-h-screen bg-gray-100 px-6 py-10">
            <div className="mx-auto max-w-5xl">

                <h1 className="text-3xl font-bold text-gray-900">
                    Northstar Cars
                </h1>

                <p className="mt-2 text-gray-500">
                    Available cars
                </p>

                <div className="mt-8 grid gap-6 md:grid-cols-3">

                    {cars.map((car) => (
                        <div
                            key={car.id}
                            className="rounded-xl bg-white p-5 shadow-sm"
                        >
                            <h2 className="text-xl font-semibold text-gray-900">
                                {car.carName}
                            </h2>

                            <p className="mt-2 text-gray-500">
                                Rent: {car.carRent}
                            </p>

                            <p className={`mt-4 font-medium ${
                                car.available
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}>
                                {car.available ? "Available" : "Unavailable"}
                            </p>
                        </div>
                    ))}

                </div>

            </div>
        </main>
    );
}