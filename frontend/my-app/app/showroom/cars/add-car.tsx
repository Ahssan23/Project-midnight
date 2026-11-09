
import { registerCar } from "../action";
import "../../../globals.css"
export default function AddCar() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        action={registerCar}
        className="w-full max-w-lg bg-white rounded-xl shadow-sm p-8 space-y-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Car</h1>
          <p className="text-gray-500 mt-1">
            Add a new car to your listing.
          </p>
        </div>

        <div>
          <label
            htmlFor="carName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Car Name
          </label>

          <input
            id="carName"
            name="carName"
            type="text"
            required
            placeholder="e.g. Toyota Corolla"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
          />
        </div>

        <div>
          <label
            htmlFor="carRent"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Rent Amount
          </label>

          <input
            id="carRent"
            name="carRent"
            type="number"
            min="0"
            step="1"
            required
            placeholder="e.g. 5000"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
          <div>
            <p className="font-medium text-gray-900">Available</p>
            <p className="text-sm text-gray-500">
              Is this car available for rent?
            </p>
          </div>

          <input
            type="checkbox"
            name="available"
            defaultChecked={true}
            className="h-5 w-5"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800"
        >
          Add Car
        </button>
      </form>
    </div>
  );
}
