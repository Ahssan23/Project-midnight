
import { cookies } from "next/headers";
    import "../../../globals.css";


export default async function Page({ params }: any) {
  try {
    const { id } = await params;
    const URL = "http://localhost:4000";
    const cookie = await cookies();
    const token = cookie.get("access_token")?.value;

    const res = await fetch(`${URL}/api/showroom/${id}`, {
      method: "GET",
      headers: { Cookie: `access_token=${token}` },
    });

    const data = await res.json();

    return (
      <html>
        <body className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
          <div className="w-full max-w-3xl rounded-xl bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">
              {data.ShowroomName}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Showroom ID: {id}
            </p>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Welcome to our showroom
              </h2>
              <p className="mt-2 text-gray-600">
                Explore our collection of vehicles.
              </p>
            </div>
          </div>
        </body>
      </html>
    );
  } catch (err) {
    return (
      <html>
        <body className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-semibold text-gray-900">
              This showroom doesn't exist.
            </h1>
            <p className="mt-2 text-gray-500">
              The showroom you're looking for could not be found.
            </p>
          </div>
        </body>
      </html>
    );
  }
}
