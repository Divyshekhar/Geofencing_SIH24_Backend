const express = require('express');
const {
  createGeofence,
  getGeofences,
  getGeofence,
  updateGeofence,
  deleteGeofence,
} = require('../controllers/geofenceController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/', authenticate, createGeofence);
router.get('/', authenticate, getGeofences);
router.get('/:id', authenticate, getGeofence);
router.put('/:id', authenticate, updateGeofence);
router.delete('/:id', authenticate, deleteGeofence);

module.exports = router;
