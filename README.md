# Custom Cron Scheduler

A full-stack application to schedule and manage HTTP requests using cron expressions.

## Project Structure

- `backend/`: Node.js/Express backend with MongoDB and custom scheduler.
- `frontend/`: React/Vite frontend for managing jobs.

## Quick Start (Local)

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (optional, for running Mongo easily)
- MongoDB (if not using Docker)

### Running with Docker Compose (Recommended)
1. Navigate to `backend/`
2. Run `docker-compose up --build`
3. Backend will be at `http://localhost:4000`
4. In a new terminal, navigate to `frontend/`
5. Run `npm install` then `npm run dev`
6. Frontend will be at `http://localhost:5173`

### Running Manually
1. **Backend**:
   - `cd backend`
   - `npm install`
   - Create `.env` from `.env.example` and set `MONGO_URI`.
   - `npm start`
2. **Frontend**:
   - `cd frontend`
   - `npm install`
   - Create `.env` from `.env.example`.
   - `npm run dev`

## Deployment

### Backend (Render)
1. Create a Web Service on Render connected to this repo.
2. Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Environment Variables:
   - `MONGO_URI`: (Secret) Your MongoDB connection string.
   - `SCHEDULER_POLL_MS`: `1000` (Optional)

### Backend (Koyeb)
1. Create a new App on Koyeb.
2. Select **GitHub** as the deployment method and choose this repository.
3. In the **Builder** section, select **Dockerfile**.
4. Set the **Docker Workdir** to `backend`.
5. In the **Environment variables** section, add:
   - `MONGO_URI`: Your MongoDB connection string.
   - `PORT`: `8000` (Koyeb default, or let it detect).
6. Click **Deploy**.

### Frontend (Vercel)
1. Create a Project on Vercel connected to this repo.
2. Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   - `VITE_API_URL`: `https://<your-render-backend>.onrender.com/api`

## Features
- Create, List, Toggle, Delete Cron Jobs.
- View execution logs (Success/Error).
- Supports 5-field (standard) and 6-field (seconds) cron expressions.
- Basic SSRF protection.
