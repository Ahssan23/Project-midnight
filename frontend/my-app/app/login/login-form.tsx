"use client";
import { useActionState, } from "react";
import { login } from "./action.js";


export default function LoginForm() {
  const [response, formAction ] = useActionState(login,null);
  return (
    <form
      action={formAction}
      className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6"
    >
      <h1 className="mb-2 text-3xl font-bold">Welcome back</h1>
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
      />

      <button
        type="submit"
        className="rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800"
      >
        Log in
      </button>

      {response && (
        <pre>{JSON.stringify(response.message, null, 2)}</pre>
      )}
    </form>
  );
}
