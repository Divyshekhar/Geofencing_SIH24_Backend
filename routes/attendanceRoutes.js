const express = require('express');
const {logAttendance} = require('../controllers/attendanceLogger');
const router = express.Router();

router.post('/in', async(req, res) =>{
    const { employee_id } = req.body;
    if (!employee_id) {
        return res.status(400).send({ error: 'employee_id is required' });
    }

    try {
        const result = await logAttendance(employee_id, 'IN');
        res.status(201).send({ message: 'Check-in successful', data: result });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to mark attendance' });
    }
});


router.post('/out', async(req, res) =>{
    const { employee_id } = req.body;
    if (!employee_id) {
        return res.status(400).send({ error: 'employee_id is required' });
    }

    try {
        const result = await logAttendance(employee_id, 'OUT');
        res.status(201).send({ message: 'Check-in successful', data: result });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to mark attendance' });
    }
});

module.exports = router;