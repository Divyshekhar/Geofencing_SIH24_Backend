const express = require('express');
const app = express();
const db = require('./config/db')
const employeeRoutes = require('./routes/employeeRoutes');  
const officeRoutes = require('./routes/officeRoutes');     
const attendanceRoutes = require('./routes/attendanceRoutes');


app.use(express.json());

app.get('/health', async (req, res) => {

  try {
    
    res.status(200).json("Connection to server successful");
  } catch (error) {
    console.error('Connect error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.use('/employee', employeeRoutes); 
app.use('/office', officeRoutes);     
app.use('/attendance', attendanceRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
