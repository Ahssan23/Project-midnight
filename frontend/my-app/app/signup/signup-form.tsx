import { signUp } from "./action.js";

export default function SignupForm() {
  return (
    <main className="min-h-screen bg-[#F8F7F4] text-[#181818]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">

        <div className="mb-10">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.16em] text-[#6B6B67]">
            Fleetly
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.035em]">
            Create your account.
          </h1>

          <p className="mt-3 text-base text-[#6B6B67]">
            Set up your account and start managing your rental fleet.
          </p>
        </div>

        <form action={signUp} className="flex flex-col gap-5">

          <div className="flex flex-col gap-2">
            <label htmlFor="companyName" className="text-sm font-medium">
              Company name
            </label>

            <input
              id="companyName"
              type="text"
              name="companyName"
              placeholder="Your company"
              className="h-12 rounded-md border border-[#E3E1DC] bg-white px-4 text-sm outline-none transition focus:border-[#181818]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
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
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a password"
              className="h-12 rounded-md border border-[#E3E1DC] bg-white px-4 text-sm outline-none transition focus:border-[#181818]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>

            <input
              id="phone"
              type="text"
              name="phone"
              placeholder="Phone number"
              className="h-12 rounded-md border border-[#E3E1DC] bg-white px-4 text-sm outline-none transition focus:border-[#181818]"
            />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium">Account type</span>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  className="h-4 w-4"
                />
                Buyer
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  className="h-4 w-4"
                />
                Seller
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 h-12 rounded-md bg-[#181818] px-4 text-sm font-medium text-white transition-colors hover:bg-black"
          >
            Create account
          </button>
        </form>
      </div>
    </main>
  );
}
