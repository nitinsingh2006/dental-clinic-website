# Dr. Nitin Dental Clinic

I built this full-stack web app for a local dental clinic so patients can pick a doctor and book an appointment online, while the clinic staff gets a simple admin page to check, update, or cancel bookings.

## Live links

- Frontend: https://dental-clinic-website-topaz-sigma.vercel.app
- Backend: https://dental-clinic-api-0tmx.onrender.com

Note: The backend runs on Render's free tier, so if nobody has opened the site in 15 minutes, the server goes to sleep. The first request might take 30 to 50 seconds to wake up.

## What it does

Patients can visit the home page, read through services, and pick a doctor, date, and time slot. The database has a unique constraint on doctor, date, and slot so two people cannot book the same slot.

The clinic staff can head over to `/admin`, log in with a password, and view all appointments in a table. From there they can change appointment status (pending, confirmed, completed, cancelled), edit details, or delete bookings.

## Tech stack

- Frontend: Next.js 14 (App Router) + Tailwind CSS + Zod for form validation
- Backend: Node.js + Express with plain SQL queries via mysql2
- Database: TiDB Cloud Serverless (MySQL compatible)
- Hosting: Vercel for the Next.js app, Render for the Express server

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
DB_USER=root
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
