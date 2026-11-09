import Link from "next/link";
import { createShowroom } from "../app/action.js";

export default function Hero() {
  return (
    <section className="px-6">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl flex-col items-center justify-center text-center">
        <p className="mb-6 text-sm font-medium uppercase tracking-[0.16em] text-[#6B6B67]">
          Rental fleet management
        </p>

        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl md:text-7xl">
          Manage your rental fleet without the mess.
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-8 text-[#6B6B67]">
          Keep your cars organized and create a simple online showroom
          where customers can browse your fleet.
        </p>

        <form action={createShowroom} className="mt-9">
          <button
            type="submit"
            className="rounded-md bg-[#181818] px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-black"
          >
            Create your showroom
          </button>
        </form>

        <p className="mt-5 text-sm text-[#6B6B67]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#181818] underline underline-offset-4"
          >
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
