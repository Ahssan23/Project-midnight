import Link from "next/link";
import { checkCookies } from "../app/action.js";

export default async function Navbar() {
  const loggedIn = await checkCookies();

  return (
    <nav className="border-b border-[#E3E1DC]">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link
          href="/home"
          className="text-xl font-semibold tracking-tight"
        >
          Fleetly
        </Link>

        <div className="flex items-center gap-6">
          {loggedIn ? (
            <Link
              href="/dashboard"
              className="text-sm font-medium"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium transition-opacity hover:opacity-60"
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="rounded-md bg-[#181818] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}