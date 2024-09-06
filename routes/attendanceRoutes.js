const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/', attendanceController.markLogs);
router.post('/hours', attendanceController.calculateTotalWorkingHours);
router.get('/all', attendanceController.allAttendance);
module.exports = router;
