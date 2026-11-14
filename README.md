# Dr. Nitin Dental Clinic

I built this full-stack web app for a local dental clinic so patients can pick a doctor and book an appointment online, while the clinic staff gets a simple admin page to check, update, or cancel bookings.

## Live links

- Frontend: https://dental-clinic-website-topaz-sigma.vercel.app
- Backend: https://dental-clinic-api-0tmx.onrender.com

Note: The backend runs on Render's free tier, so if nobody has opened the site in 15 minutes, the server goes to sleep. The first request might take 30 to 50 seconds to wake up.

## What it does

The home page is divided into five sections in order:
1. Hero: quick introduction to the clinic with a direct Book Appointment button that scrolls straight to the booking section.
2. Services: cards listing checkups, cleanings, root canals, braces, and implants.
3. Book a Slot: booking form where patients enter their name, phone number, choose a doctor, select an appointment date, and pick an available time slot.
4. Testimonials: sample reviews displayed for demonstration to give prospective patients an idea of past treatment experiences.
5. Footer: clinic address in Vijay Nagar, phone number, email, and quick links.

The database has a unique constraint on doctor, date, and slot so two people cannot book the same slot.

The clinic staff can head over to `/admin`, log in with a password, and view all appointments. On desktop it shows a full table, and on phones it switches to a card layout so nothing overflows. From there staff can edit patient details, update appointment status (pending, confirmed, completed, cancelled), or delete bookings.

## Tech stack

- Frontend: Next.js 14 (App Router) + Tailwind CSS + Zod for form validation
- Backend: Node.js + Express with plain SQL queries via mysql2
- Database: TiDB Cloud Serverless (MySQL compatible)
- Hosting: Vercel for the Next.js app, Render for the Express server

## Backend API endpoints

All appointment endpoints except POST require the `x-admin-token` header matching the server's `ADMIN_TOKEN`.

- `GET /`
  Public health check. Returns `{"message": "Dental Clinic API is running"}`.

- `POST /api/appointments`
  Public endpoint to book an appointment.
  Body: `{ "patientName": "...", "phone": "...", "doctor": "...", "appointmentDate": "YYYY-MM-DD", "timeSlot": "..." }`
  Returns the created record (201) or a 409 conflict if that doctor slot is already taken. Rate limited to 10 requests per 15 minutes per IP.

- `GET /api/appointments`
  Admin only. Returns an array of all appointments sorted by creation date descending.

- `GET /api/appointments/:id`
  Admin only. Returns a single appointment by its primary key ID.

- `PUT /api/appointments/:id`
  Admin only. Updates patient name, phone, doctor, appointment date, time slot, and status (`pending`, `confirmed`, `completed`, `cancelled`).

- `DELETE /api/appointments/:id`
  Admin only. Deletes the booking by ID.

## Running locally

You need Node.js and a running MySQL instance.

1. Clone the repo and install dependencies for both sides:

```bash
cd client && npm install
cd ../server && npm install
```

2. Set up the database:

Create a database named `dental_clinic` in MySQL. When you start the server, it automatically runs `CREATE TABLE IF NOT EXISTS appointments` with all columns and the unique slot constraint.

3. Configure environment variables:

In `server/.env`:
```
PORT=5000
FRONTEND_ORIGIN=http://localhost:3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_password
DB_NAME=dental_clinic
DB_SSL=false
ADMIN_TOKEN=your_admin_secret
```

In `client/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start both servers:

```bash
# Terminal 1 (backend)
cd server && npm start

# Terminal 2 (frontend)
cd client && npm run dev
```

The site will be live at `http://localhost:3000`.

## Production environment variables

For backend on Render:
- `PORT`: 10000
- `FRONTEND_ORIGIN`: https://dental-clinic-website-topaz-sigma.vercel.app
- `DB_HOST`: your remote MySQL or TiDB host
- `DB_PORT`: 4000 (for TiDB) or 3306
- `DB_USER`: your remote database user
- `DB_PASSWORD`: your remote database password
- `DB_NAME`: dental_clinic
- `DB_SSL`: true
- `ADMIN_TOKEN`: secret token used to log into /admin

For frontend on Vercel:
- `NEXT_PUBLIC_API_URL`: https://dental-clinic-api-0tmx.onrender.com

## Things that annoyed me while building and deploying this

1. Hosted MySQL and SSL certificates: On local machine `DB_SSL=false` works fine. But TiDB Cloud and most hosted MySQL providers require SSL/TLS. Setting up `mysql2` to play nice with TLS without failing on self-signed certificate chains took a couple tries until I configured `minVersion: TLSv1.2` and proper flags in `db.js`.

2. CORS headaches: Because the frontend is hosted on Vercel and the backend on Render, browsers block cross-origin requests unless headers match strictly. Make sure `FRONTEND_ORIGIN` on the server does not have a trailing slash, otherwise Express CORS rejects the origin header sent by Vercel.

3. Render cold starts: On Render's free tier, the web service spins down after 15 minutes of inactivity. When you test the site after a break, the booking submission will sit on "Booking..." for almost a minute while Render boots the container.
