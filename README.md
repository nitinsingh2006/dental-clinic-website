# Dr. Nitin Dental Clinic

A full-stack dental clinic web application that allows patients to book appointments online and provides clinic staff with an admin panel to manage all bookings.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | Next.js 14, React 18, Tailwind CSS, Zod |
| Backend   | Node.js, Express.js                     |
| Database  | MySQL (via mysql2, plain SQL)           |
| Styling   | Tailwind CSS                            |

---

## Folder Structure

```
Dental Clinic Website/
├── client/                        # Next.js frontend
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── page.js                # Home page
│   │   └── admin/
│   │       └── page.js            # Admin panel page
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Hero.js
│   │   ├── Services.js
│   │   ├── BookingForm.js
│   │   ├── Footer.js
│   │   └── AdminTable.js
│   ├── jsconfig.json
│   ├── .env.example
│   ├── .env.local
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── server/                        # Express.js backend
│   ├── controllers/
│   │   └── appointmentController.js
│   ├── routes/
│   │   └── appointments.js
│   ├── db.js
│   ├── schema.sql
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Running Locally

### Prerequisites

- Node.js v18+
- MySQL 8.x running locally
- npm

---

### 1. MySQL Setup (Linux)

```bash
# Install MySQL
sudo apt install mysql-server

# Start the service
sudo systemctl start mysql
sudo systemctl enable mysql

# Log in (no password by default on Ubuntu)
sudo mysql

# Inside the MySQL shell:
CREATE DATABASE IF NOT EXISTS dental_clinic;
# If you want a dedicated user (optional):
CREATE USER 'dentaluser'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON dental_clinic.* TO 'dentaluser'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Optional: run the schema manually (the server also does this automatically on start)
mysql -u root dental_clinic < server/schema.sql
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` (or edit the existing one):

```env
PORT=5000
FRONTEND_ORIGIN=http://localhost:3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=dental_clinic
DB_SSL=false
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server automatically creates the `appointments` table on startup if it doesn't exist. You will see `MySQL connected` in the console.

---

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env.local` file in `client/` (or use the existing one):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend (`server/.env`)

| Variable           | Description                                   | Example                   |
|--------------------|-----------------------------------------------|---------------------------|
| `PORT`             | Port for the Express server                   | `5000`                    |
| `FRONTEND_ORIGIN`  | Allowed CORS origin (your frontend URL)       | `http://localhost:3000`   |
| `DB_HOST`          | MySQL host                                    | `localhost`               |
| `DB_PORT`          | MySQL port                                    | `3306`                    |
| `DB_USER`          | MySQL user                                    | `root`                    |
| `DB_PASSWORD`      | MySQL password                                | *(empty for local root)*  |
| `DB_NAME`          | MySQL database name                           | `dental_clinic`           |
| `DB_SSL`           | Set to `true` for hosted MySQL providers      | `false`                   |

### Frontend (`client/.env.local`)

| Variable               | Description                     | Example                      |
|------------------------|---------------------------------|------------------------------|
| `NEXT_PUBLIC_API_URL`  | Base URL of the backend API     | `http://localhost:5000`      |

---

## API Endpoints

| Method | Path                          | Description                         |
|--------|-------------------------------|-------------------------------------|
| GET    | `/`                           | Health check — API status message   |
| POST   | `/api/appointments`           | Create a new appointment            |
| GET    | `/api/appointments`           | Get all appointments (newest first) |
| GET    | `/api/appointments/:id`       | Get a single appointment by ID      |
| PUT    | `/api/appointments/:id`       | Update an appointment by ID         |
| DELETE | `/api/appointments/:id`       | Delete an appointment by ID         |

### Appointment Object Shape

```json
{
  "id": 1,
  "patientName": "John Doe",
  "phone": "9876543210",
  "doctor": "Dr. Sarah Patel",
  "appointmentDate": "2024-12-15",
  "timeSlot": "10:00 AM",
  "status": "pending",
  "createdAt": "2024-11-13 06:30:00"
}
```

**Status values:** `pending` | `confirmed` | `completed` | `cancelled`

---

## Live URLs

| Service  | URL                             |
|----------|---------------------------------|
| Frontend | *https://your-app.vercel.app*   |
| Backend  | *https://your-api.onrender.com* |

---

## Deployment Notes

### Frontend — Vercel

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com) and set **root directory** to `client/`.
3. Add the environment variable:
   - `NEXT_PUBLIC_API_URL` → your Render backend URL (e.g., `https://dental-clinic-api.onrender.com`)
4. Deploy.

### Backend — Render

1. Create a new **Web Service** on [Render](https://render.com) pointing to the `server/` directory.
2. Set **Build Command** to `npm install` and **Start Command** to `node server.js`.
3. Add environment variables:
   - `FRONTEND_ORIGIN` → your Vercel frontend URL
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` → from your hosted MySQL provider
   - `DB_SSL=true` (required for most hosted MySQL providers)

### Database — Free Hosted MySQL

Use [Aiven](https://aiven.io) or [TiDB Cloud](https://tidbcloud.com) for a free hosted MySQL instance.
Both require SSL — set `DB_SSL=true` in your Render environment variables.
Copy the host, port, username, password and database name from the provider dashboard into the `DB_*` env vars on Render.
