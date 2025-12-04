const express = require('express');
const router = express.Router();
const CronJob = require('../models/CronJob');
const JobLog = require('../models/JobLog');
const cronParser = require('cron-parser');

// Helper to validate URL
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return ['http:', 'https:'].includes(url.protocol);
  } catch (_) {
    return false;
  }
};

// Helper to validate private IP (Basic SSRF)
const isPrivateIp = (urlStr) => {
    try {
        const url = new URL(urlStr);
        const hostname = url.hostname;
        // Simple check for localhost and private ranges
        // In a real prod env, we'd resolve DNS and check IP, but this is basic.
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') return true;
        if (hostname.startsWith('192.168.') || hostname.startsWith('10.')) return true;
        if (hostname.startsWith('172.') && parseInt(hostname.split('.')[1]) >= 16 && parseInt(hostname.split('.')[1]) <= 31) return true;
        return false;
    } catch (e) {
        return true; // Fail safe
    }
};

// GET /api/jobs/list
router.get('/list', async (req, res) => {
  try {
    const jobs = await CronJob.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/jobs/create
router.post('/create', async (req, res) => {
  try {
    const { name, url, method, headers, body, cron } = req.body;

    if (!name || !url || !cron) {
      return res.status(400).json({ error: 'Name, URL, and Cron expression are required' });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    if (isPrivateIp(url)) {
        return res.status(400).json({ error: 'Targeting private IPs is not allowed' });
    }

    if (method && !['GET', 'POST', 'PUT', 'DELETE'].includes(method)) {
        return res.status(400).json({ error: 'Invalid method' });
    }

    try {
      cronParser.parseExpression(cron);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid cron expression' });
    }

    // Compute initial nextRunAt
    const interval = cronParser.parseExpression(cron, { utc: false });
    const nextRunAt = interval.next().toDate();

    const job = new CronJob({
      name,
      url,
      method,
      headers,
      body,
      cron,
      nextRunAt
    });

    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/jobs/:id/toggle
router.post('/:id/toggle', async (req, res) => {
  try {
    const job = await CronJob.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    job.active = !job.active;
    
    if (job.active) {
        // Re-calculate next run if activating
        try {
            const interval = cronParser.parseExpression(job.cron, { utc: false });
            job.nextRunAt = interval.next().toDate();
        } catch (e) {
            job.nextRunAt = null; // Should not happen if validated on create, but safe guard
        }
    } else {
        job.nextRunAt = null;
    }

    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', async (req, res) => {
  try {
    await CronJob.findByIdAndDelete(req.params.id);
    await JobLog.deleteMany({ jobId: req.params.id }); // Cleanup logs
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/:id/logs
router.get('/:id/logs', async (req, res) => {
  try {
    const logs = await JobLog.find({ jobId: req.params.id })
      .sort({ runAt: -1 })
      .limit(200);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
