# Rental Management System frontend

A small Next.js App Router frontend with login, signup, and dynamic showroom pages.

## Run it

1. Start your API at `http://localhost:4000`.
2. Run `npm install` once.
3. Run `npm run dev` and open `http://localhost:3000`.

Set `API_BASE_URL` in `.env.local` to change the base API URL. The API calls live beside their pages in `app/<route>/action.js`.

## Routes and payloads

- `app/login/action.js` sends `{ username, email, password }` to `POST /api/login`. The username and email values are the same input so either backend field can be used.
- `app/signup/action.js` sends `{ name, email, password, role, phone }` to `POST /api/signup`.
- `app/showroom/action.js` sends `{ ShowroomName, OwnernName, password }` to `POST /api/showroom` and saves a returned token as an HTTP-only cookie.
- `app/showroom/[id]/action.js` loads the showroom and cars with that token. The detail page is `/showroom/:id` and shows the showroom fields and returned cars.

The frontend saves a returned `token` (or `accessToken`) in an HTTP-only cookie after login or showroom creation. The current backend GET routes identify showroom and cars by token; they do not accept a showroom ID. The page checks that the token returned the same showroom ID in the URL. To let anyone open any showroom by a pasted ID, the backend will need a `GET /api/showroom/:id` route.


