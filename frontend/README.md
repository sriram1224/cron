# Cron Scheduler Frontend

React/Vite frontend for the Custom Cron Scheduler.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables:
   Copy `.env.example` to `.env` and set `VITE_API_URL` to your backend URL.
   
   Local default: `http://localhost:4000/api`

3. Run locally:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Deployment (Vercel)

1. Create a new Project in Vercel.
2. Select the `frontend` folder of this repo.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-backend.onrender.com/api`).
