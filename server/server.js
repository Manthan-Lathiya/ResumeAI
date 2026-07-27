const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Express Backend' });
});

const PORT = process.env.PORT || 5000;

// Connect DB and Start Server
// connectDB(); // Placeholder DB connection call

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
