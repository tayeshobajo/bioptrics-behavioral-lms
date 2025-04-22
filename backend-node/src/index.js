require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api/learning', courseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});