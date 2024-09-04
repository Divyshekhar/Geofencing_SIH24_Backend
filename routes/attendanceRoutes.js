const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/', attendanceController.markLogs);
router.post('/hours', attendanceController.calculateTotalWorkingHours);

module.exports = router;
