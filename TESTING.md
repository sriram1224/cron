# Testing Guide

## Smoke Test Steps

1. **Start the Application**
   - Ensure backend is running (`http://localhost:4000`) and connected to MongoDB.
   - Ensure frontend is running (`http://localhost:5173`).

2. **Prepare a Test Endpoint**
   - Go to [Webhook.site](https://webhook.site) or [PTSv2](https://ptsv2.com).
   - Copy your unique URL.

3. **Create a Job**
   - Open the Frontend.
   - Fill in the "Create New Job" form:
     - **Name**: `Smoke Test`
     - **URL**: (Paste your webhook URL)
     - **Method**: `POST`
     - **Cron**: `*/1 * * * *` (Every minute)
     - **Body**: `{"hello": "world"}`
   - Click "Create Job".

4. **Verify Execution**
   - Wait for the next minute mark.
   - Check Webhook.site: You should see a POST request with the JSON body.
   - In the Frontend, click "Logs" on the job card.
   - You should see a `SUCCESS` log with the response status (usually 200).

5. **Test Toggle**
   - Click "Pause" on the job card.
   - Wait a minute.
   - Verify NO new requests appear on Webhook.site.
   - Click "Resume".

6. **Test Delete**
   - Click "Delete" on the job card.
   - Confirm deletion.
   - The job should disappear from the list.

## Manual API Testing (cURL)

**Create Job:**
```bash
curl -X POST http://localhost:4000/api/jobs/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Curl Test",
    "url": "https://httpbin.org/get",
    "method": "GET",
    "cron": "*/1 * * * *"
  }'
```

**List Jobs:**
```bash
curl http://localhost:4000/api/jobs/list
```

**Toggle Job (Replace :id):**
```bash
curl -X POST http://localhost:4000/api/jobs/:id/toggle
```

**Get Logs (Replace :id):**
```bash
curl http://localhost:4000/api/jobs/:id/logs
```
