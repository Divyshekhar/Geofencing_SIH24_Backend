const express = require('express');
const router = express.Router();
const officeController = require('../controllers/officeController')

router.post('/', officeController.createOffice);
router.get('/:id', officeController.getOffice);
router.patch('/:id', officeController.updateOffice);
router.delete('/:id', officeController.deleteOffice);

module.exports = router;