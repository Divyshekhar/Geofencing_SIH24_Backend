const express = require('express');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const geofenceRoutes = require('./routes/geofenceRoutes');
const locationRoutes = require('./routes/locationRoutes');

// Load environment variables
require('dotenv').config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/geofences', geofenceRoutes);
app.use('/locations', locationRoutes);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});