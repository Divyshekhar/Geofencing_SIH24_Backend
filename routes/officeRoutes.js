const express = require('express');
const {
  createGeofence,
  getGeofences,
  getGeofence,
  updateGeofence,
  deleteGeofence,
  getOfficeData,
} = require('../controllers/officeController');
// const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.get('/:id', getOfficeData);
// router.get('/', authenticate, getGeofences);
// router.get('/:id', authenticate, getGeofence);
// router.put('/:id', authenticate, updateGeofence);
// router.delete('/:id', authenticate, deleteGeofence);

module.exports = router;
