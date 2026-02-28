# Ristek Form Builder

A modern, full-stack form building application featuring an AI-powered form generation module, built with Next.js, Express, and Prisma.

## 🚀 Native Vercel Deployment

This project is configured to run **both** the Next.js frontend and the Express backend natively on Vercel as Serverless Functions. This means you do not need a separate backend host like Render.

### 🛠️ Prerequisites
- **Node.js** (v20+)
- **PostgreSQL** (e.g., [Neon.tech](https://neon.tech))
- **Vercel Account**

### ⚙️ Environment Variables (Vercel)
Set these in your Vercel Project Settings:

| Variable | Value |
| :--- | :--- |
| `DATABASE_URL` | Your PostgreSQL connection string |
| `DIRECT_URL` | Same as above (for migrations) |
| `AUTH_SECRET` | A secure random string |
| `GEMINI_API_KEY` | Your Google Gemini API Key |
| `NEXT_PUBLIC_API_URL` | `/api/express` |

---

## 📂 Repository Structure (Optimized)

The repository has been restructured to have all configuration files at the root for seamless Vercel integration:

```text
ristek-form-builder/
├── backend/                # Express API Core logic
├── src/                    # Frontend (Next.js App Router)
├── vercel-serve/           # Vercel Serverless Entry Point
├── public/                 # Static assets
├── vercel.json             # Vercel Routing Configuration
└── package.json            # Unified dependencies & scripts
```

---

## 🚀 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   npm --prefix backend install
   ```
2. **Setup Database**:
   ```bash
   npm --prefix backend run prisma:generate
   npm --prefix backend run prisma:migrate
   ```
3. **Run the app**:
   ```bash
   npm run dev
   ```

---