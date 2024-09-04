const express = require('express');
const app = express();
const db = require('./config/db')
const employeeRoutes = require('./routes/employeeRoutes');  // Ensure this path is correct
const officeRoutes = require('./routes/officeRoutes');      // Ensure this path is correct
const attendanceRoutes = require('./routes/attendanceRoutes');      // Ensure this path is correct


app.use(express.json());

app.get('/health', async (req, res) => {

  try {
    const offices = await db('offices').select('*');
    res.status(200).json(offices);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.use('/employee', employeeRoutes);  // Ensure employeeRoutes is a router object
app.use('/office', officeRoutes);      // Ensure officeRoutes is a router object
app.use('/attendance', attendanceRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
