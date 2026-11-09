"use client";

import { useActionState } from "react";
import { login } from "./action.js";

export default function LoginForm() {
  const [response, formAction] = useActionState(login, null);

  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#181818]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <div className="mb-10">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.16em] text-[#6B6B67]">
            Fleetly
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.035em]">
            Welcome back.
          </h1>

          <p className="mt-3 text-base text-[#6B6B67]">
            Log in to manage your rental fleet.
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              className="h-12 rounded-md border border-[#E3E1DC] bg-white px-4 text-sm outline-none transition focus:border-[#181818]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              className="h-12 rounded-md border border-[#E3E1DC] bg-white px-4 text-sm outline-none transition focus:border-[#181818]"
            />
          </div>

          <button
            type="submit"
            className="mt-2 h-12 rounded-md bg-[#181818] px-4 text-sm font-medium text-white transition-colors hover:bg-black"
          >
            Log in
          </button>

          {response && (
            <p className="text-sm text-red-600">
              {response.message}
            </p>
          )}
        </form>

        <p className="mt-7 text-sm text-[#6B6B67]">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-[#181818] underline underline-offset-4"
          >
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
