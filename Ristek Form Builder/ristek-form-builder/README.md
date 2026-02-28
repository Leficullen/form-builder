# Ristek Form Builder

A modern, full-stack form building application (inspired by Google Forms) featuring an AI-powered form generation module, built with Next.js, Express, and Prisma.

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js (App Router, Turbopack)
- **Styling**: Tailwind CSS 4, Framer Motion
- **UI Components**: Radix UI, Shadcn UI, Recharts, Remix Icon
- **State Management**: React 19 (Hooks)
- **Type Safety**: TypeScript, Zod

### Backend
- **Server**: Express.js 5
- **Runtime**: Node.js with `tsx` (TypeScript Execution)
- **Database**: PostgreSQL (Prisma ORM)
- **Auth**: JWT, bcrypt
- **AI**: Gemini API (@google/generative-ai)
- **API Documentation**: Swagger UI

---

## 📂 Repository Structure

```text
ristek-form-builder/
├── backend/                # Express API & Database
│   ├── prisma/             # Prisma Schema & Migrations
│   ├── src/                # API Source Code
│   │   ├── routes/         # API Routes (Auth, Forms, etc.)
│   │   ├── middleware/     # Auth & Error middlewares
│   │   ├── lib/            # Shared utilities (Prisma client)
│   │   └── server.ts       # API Entry point
│   └── package.json        # Backend specific dependencies
├── src/                    # Frontend (Next.js)
│   ├── app/                # App Router Pages
│   ├── components/         # UI Components (Atomic Design)
│   ├── lib/                # API client & Utilities
│   └── server/             # Server hooks/actions
├── public/                 # Static assets
├── package.json            # Root configuration & scripts
└── .env                    # Shared environment variables
```

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v20 or newer recommended)
- **npm** or **pnpm**
- **PostgreSQL** instance (Local or cloud-based like [Neon](https://neon.tech))

---

## ⚙️ Environment Variables

The project use `.env` files for configuration.

### Backend Setup (`/backend/.env`)
Create a `.env` inside the `backend/` directory:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `4000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `DIRECT_URL` | Direct DB connection (for migrations) | `postgresql://user:pass@host:5432/db` |
| `AUTH_SECRET` | Secret key for JWT signing | `your_secret_string` |
| `GEMINI_API_KEY` | Google Gemini AI key | `AIzaSy...` |

### Frontend Setup (`/.env`)
Create a `.env` in the root directory:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL of the backend API | `http://localhost:4000` |

---

## 🚀 Local Setup & Installation

Follow these steps to get the project running locally:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ristek-form-builder.git
cd ristek-form-builder
```

### 2. Install Dependencies
Install both frontend and backend dependencies:
```bash
# Install root (frontend) dependencies
npm install

# Install backend dependencies
npm --prefix backend install
```

### 3. Database Initialization
Generate the Prisma Client and run migrations (ensure your `DATABASE_URL` is set):
```bash
# Generate Prisma Client
npm --prefix backend run prisma:generate

# Run DB Migrations
npm --prefix backend run prisma:migrate
```

---

## 🏃 Running the App

### Option A: Run Both (Recommended)
You can start both the frontend and backend concurrently from the root:
```bash
npm run dev
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000](http://localhost:4000)

### Option B: Run Separately
If you need to debug one specifically:
```bash
# Start Backend only
npm run dev:api

# Start Frontend only
npm run dev:web
```

---

## 🏥 Health Checks & Documentation

- **Health Check**: `GET http://localhost:4000/health`
- **Root API**: `GET http://localhost:4000/`
- **API Documentation**: Open your browser at `http://localhost:4000/api-docs` to view Swagger documentation.

---

## 🛠️ Useful Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Start both FE and BE concurrently |
| `npm --prefix backend run prisma:studio` | Open Prisma Studio to view database data |
| `npm --prefix backend run prisma:generate` | Update Prisma Client after schema changes |
| `npm run lint` | Run ESLint across the project |

---

## ❓ Troubleshooting

### 1. Error: `Cannot find module '.prisma/client/default'`
This happens if the Prisma Client hasn't been generated. 
**Fix**: Run `npm --prefix backend run prisma:generate`.

### 2. `net::ERR_CONNECTION_REFUSED` in browser
The backend is likely not running. Ensure you see `API running on http://localhost:4000` in your terminal.

### 3. Postgres Migration Fails
Ensure your `DATABASE_URL` in `.env` is correct and the database is accessible. If using Neon with Prisma, ensure you use `sslmode=require`.

### 4. Port Conflict
If port 3000 or 4000 is taken, you can change them in the `.env` file or by running `PORT=5000 npm run dev:api`.

---

## 📝 License
[MIT](LICENSE)
