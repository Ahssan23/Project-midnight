import { signUp } from "./action.js";

export default function SignupForm() {
  return (
    // <html>
    //   <body>
        
    <form
      action={signUp}
      className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6"
    >
      <h1 className="mb-2 text-3xl font-bold">Create your account</h1>

      <input
        type="text"
        name="companyName"
        placeholder="Company name"
        className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
      />

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

      <input
        type="text"
        name="phone"
        placeholder="Phone"
        className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
      />

   <div className="flex gap-6">
  <label>
    <input type="radio" name="role" value="buyer" />
    Buyer
  </label>

  <label>
    <input type="radio" name="role" value="seller" />
    Seller
  </label>
</div>

      <button
        type="submit"
        className="rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800"
      >
        Sign up
      </button>
    </form>
      //   </body>
      // </html>

  );
}