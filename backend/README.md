# Cron Scheduler Backend

Node.js/Express backend with a custom cron scheduler.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables:
   Copy `.env.example` to `.env` and set `MONGO_URI`.

3. Run locally:
   ```bash
   npm start
   # or
   npm run dev
   ```

4. Run with Docker:
   ```bash
   docker-compose up --build
   ```

## Deployment (Render)

1. Create a Web Service on Render.
2. Connect this repo.
3. Set Build Command: `npm install`
4. Set Start Command: `node server.js`
5. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string.
