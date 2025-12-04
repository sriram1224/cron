const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
console.log('Current working directory:', process.cwd());
console.log('Environment file path:', path.join(__dirname, '.env'));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const jobRoutes = require('./routes/jobs');
const startScheduler = require('./services/scheduler');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

console.log('MONGO_URI:', MONGO_URI); // Debug log

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/jobs', jobRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: "ok", 
        db: mongoose.connection.readyState === 1 ? "connected" : "disconnected", 
        scheduler: "running" 
    });
});

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start Scheduler
    startScheduler();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
