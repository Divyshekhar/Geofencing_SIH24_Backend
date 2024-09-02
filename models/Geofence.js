const mongoose = require('mongoose');

const GeofenceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radius: { type: Number, required: true },
});

module.exports = mongoose.model('Geofence', GeofenceSchema);
