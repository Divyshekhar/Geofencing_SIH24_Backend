const express = require('express');
const { updateLocation, getLocationStatus } = require('../controllers/locationController');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/update', authenticate, updateLocation);
router.get('/status', authenticate, getLocationStatus);

module.exports = router;
