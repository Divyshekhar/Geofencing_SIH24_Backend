const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.post('/create', employeeController.createEmployeeWithPassword);
router.post('/:id/signin', employeeController.verifyPassword);
router.get('/all', employeeController.allEmployee);
router.get('/:id', employeeController.getEmployee);
router.get('/:id/location', employeeController.getOfficeCoordinates);
router.patch('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;