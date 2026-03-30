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
});
