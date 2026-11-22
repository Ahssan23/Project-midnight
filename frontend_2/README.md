# Rental Management System frontend

A Next.js App Router frontend for buyers browsing rental cars and sellers managing a showroom.

## Run it

1. Start the API at `http://localhost:4000`.
2. Run `npm install` once.
3. Run `npm run dev` and open `http://localhost:3000`.

Set `API_BASE_URL` in `.env.local` to change the API base URL. Server-side API calls live beside their routes in `app/<route>/action.js` or in `lib/auth.js` for role verification.

## Role and route behavior

- Login stores the access token in an HTTP-only cookie and checks `GET /api/auth/verify-role` using the bearer token. A JSON `true` means seller; JSON `false` means buyer. Invalid tokens should return `401` or `403`.
- Sellers land on `/showroom`. Their showroom, inventory, car creation, and `/booking` routes are restricted to seller accounts.
- Buyers land on `/cars`, which lists cars they can browse. Selecting a car with a showroom ID opens `/showroom/:showroomId/car/:carId`; cars without one open at `/cars/:id`. The booking button is a disabled placeholder until booking is implemented.
- Buyers can open a specific public showroom at `/showroom/:id`. The page shows that showroom's public details and its available cars.
- `/showroom/car/:id` redirects to the general car detail route at `/cars/:id` for older links.
- Signup sends `{ name, email, password, role, phone }` to `POST /api/signup`. The backend must validate or assign the role; a frontend choice is not an authorization check.

## API expectations

- `GET /api/auth/verify-role` reads the bearer token and returns a JSON boolean. It must verify the token before deciding whether the authenticated user is a seller.
- Seller inventory requests use authenticated `GET /api/car` and return only that seller's cars.
- Buyer showroom pages request `GET /api/car?showroomId=<id>` without an access token. That public endpoint should return only available cars and public fields for the requested showroom.
- The general buyer catalog at `/cars` still needs a public all-available-cars endpoint if buyers should browse cars across showrooms.
- `POST /api/car` creates a seller-owned car from `{ carName, carRent, showroomId, available }`.
- `GET /api/showroom` returns the authenticated seller's showroom. `GET /api/showroom/:id` must allow buyers to view public showroom fields and sellers to view showrooms they manage.
- Buyer car objects from `GET /api/car` need a `showroomId` (or equivalent relationship) so the frontend can filter cars for `/showroom/:id` and link back to each showroom.
- `POST /api/showroom` creates a showroom for an authenticated seller.
- `GET /api/booking` returns an array of bookings for cars managed by the authenticated seller.
- The backend must enforce these permissions for every request. Frontend route guards only control navigation and presentation.

The showroom detail page is `/showroom/:id`. It requests `GET /api/showroom/:id`, falls back to the signed-in seller's `GET /api/showroom` route for older API versions, and checks that the returned showroom ID matches the URL.
