const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const notificationsRouter = require('./routes/notifications');
const https = require('https');


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', notificationsRouter);
app.use('/api/notifications', notificationsRouter); 

// Basic health check
app.get('/', (req, res) => {
  res.send('Techyarts Backend Server is Operating at Peak Capacity');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // ── Render Wake-Up Routine ──
  // Pings the backend URL every 14 minutes to keep the Render free tier instance alive.
  const WAKEUP_URL = process.env.BACKEND_URL;
  if (WAKEUP_URL && WAKEUP_URL.startsWith('http')) {
    console.log('[Wakeup] Auto-pinging enabled for:', WAKEUP_URL);
    setInterval(() => {
      https.get(WAKEUP_URL, (res) => {
        console.log('[Wakeup] Instance pinged successfully. Status:', res.statusCode, 'at', new Date().toLocaleTimeString());
      }).on('error', (err) => {
        console.error('[Wakeup] Ping failed:', err.message);
      });
    }, 14 * 60 * 1000); // Ping every 14 minutes
  }
});

