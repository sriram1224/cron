const cronParser = require('cron-parser');
const CronJob = require('../models/CronJob');
const JobLog = require('../models/JobLog');
const sendRequest = require('../utils/sendRequest');

const SCHEDULER_POLL_MS = process.env.SCHEDULER_POLL_MS || 1000;

const startScheduler = () => {
  console.log(`Scheduler started with poll interval ${SCHEDULER_POLL_MS}ms`);

  const tick = async () => {
    try {
      const now = new Date();
      
      // Find jobs that are active and due (nextRunAt <= now OR nextRunAt is null)
      // Note: We need to be careful not to pick up jobs that just ran if the clock hasn't ticked enough, 
      // but nextRunAt update handles that.
      const jobs = await CronJob.find({
        active: true,
        $or: [
          { nextRunAt: { $lte: now } },
          { nextRunAt: null }
        ]
      });

      for (const job of jobs) {
        // Double check to avoid race conditions if multiple instances (though not designed for that yet)
        // Also compute next run time immediately to prevent re-entry in next tick if processing is slow
        
        try {
            // Calculate next run time first to ensure we have a valid schedule
            const interval = cronParser.parseExpression(job.cron, { utc: false });
            const nextRun = interval.next().toDate();

            // Create STARTED log
            await JobLog.create({
                jobId: job._id,
                status: 'STARTED',
                runAt: now
            });

            // Update job to prevent re-selection
            // We update lastRunAt to now, and nextRunAt to the computed next time
            job.lastRunAt = now;
            job.nextRunAt = nextRun;
            await job.save();

            // Perform request asynchronously (don't block the loop)
            sendRequest(job).then(async (result) => {
                let responseBody = '';
                if (result.data) {
                    responseBody = JSON.stringify(result.data);
                    if (responseBody.length > 10000) {
                        responseBody = responseBody.substring(0, 10000) + '... (truncated)';
                    }
                }

                if (result.success) {
                    await JobLog.create({
                        jobId: job._id,
                        status: 'SUCCESS',
                        responseStatus: result.status,
                        responseBody: responseBody,
                        runAt: new Date() // Log completion time or keep start time? Req says create log on success.
                    });
                } else {
                    await JobLog.create({
                        jobId: job._id,
                        status: 'ERROR',
                        responseStatus: result.status,
                        error: result.error,
                        responseBody: responseBody, // Might have error body
                        runAt: new Date()
                    });
                }
            });

        } catch (err) {
            console.error(`Error processing job ${job.name} (${job._id}):`, err);
            // If cron parsing fails or other critical error, disable job
            job.active = false;
            job.nextRunAt = null;
            await job.save();
            
            await JobLog.create({
                jobId: job._id,
                status: 'ERROR',
                error: `Scheduler error: ${err.message}`,
                runAt: now
            });
        }
      }

    } catch (error) {
      console.error('Scheduler tick error:', error);
    }

    setTimeout(tick, SCHEDULER_POLL_MS);
  };

  tick();
};

module.exports = startScheduler;
