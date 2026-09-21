"use client";
import {signUp} from "./action.js";

type Role = "buyer" | "seller";

export default function Signup() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Get started with your business account.
          </p>
        </div>

        <form action={signUp} className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
          {/* Role */}
          <fieldset>
            <legend className="mb-3 text-sm font-medium text-zinc-200">
              I am a
            </legend>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-700 p-4 transition hover:border-zinc-500">
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  required
                  className="h-4 w-4"
                />

                <span className="text-sm text-white">Buyer</span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-700 p-4 transition hover:border-zinc-500">
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  className="h-4 w-4"
                />

                <span className="text-sm text-white">Seller</span>
              </label>
            </div>
          </fieldset>

          {/* Company */}
          <div>
            <label
              htmlFor="companyName"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              Company name
            </label>

            <input
              id="companyName"
              name="companyName"
              type="text"
              autoComplete="organization"
              maxLength={100}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white"
              placeholder="Your company"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white"
              placeholder="you@company.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              Phone number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={20}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white"
              placeholder="+1 555 123 4567"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-zinc-200"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-white px-4 py-3 font-medium text-black transition hover:bg-zinc-200"
          >
            Create account
          </button>
        </form>
      </div>
    </main>
  );
}
