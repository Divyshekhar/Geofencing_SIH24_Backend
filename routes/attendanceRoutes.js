const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/', attendanceController.markLogs);
// router.post('/', attendanceController.markAttendance);
router.post('/hours', attendanceController.calculateTotalWorkingHours);
router.get('/all', attendanceController.allAttendance);
router.get('/allhours', attendanceController.allHourlyAttendance);
module.exports = router;
