const express = require('express');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const officeRoutes = require('./routes/officeRoutes');
const locationRoutes = require('./routes/locationRoutes');
const attendanceRoutes = require ('./routes/attendanceRoutes');
require('dotenv').config();

const app = express();


app.use(express.json());

app.use('/attedance', attendanceRoutes); // marks the attendance for the particular employee
app.use('/auth', authRoutes);
app.use('/office', officeRoutes); //gives the location data about the office
app.use('/locations', locationRoutes);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});