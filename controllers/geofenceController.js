const Geofence = require('../models/Geofence');

exports.createGeofence = async (req, res) => {
  const { name, latitude, longitude, radius } = req.body;

  try {
    const geofence = new Geofence({ name, latitude, longitude, radius });
    await geofence.save();
    res.status(201).json(geofence);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getGeofences = async (req, res) => {
  try {
    const geofences = await Geofence.find();
    res.json(geofences);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getGeofence = async (req, res) => {
  try {
    const geofence = await Geofence.findById(req.params.id);
    if (!geofence) {
      return res.status(404).json({ error: 'Geofence not found' });
    }
    res.json(geofence);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateGeofence = async (req, res) => {
  const { name, latitude, longitude, radius } = req.body;

  try {
    const geofence = await Geofence.findByIdAndUpdate(
      req.params.id,
      { name, latitude, longitude, radius },
      { new: true }
    );

    if (!geofence) {
      return res.status(404).json({ error: 'Geofence not found' });
    }

    res.json(geofence);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteGeofence = async (req, res) => {
  try {
    const geofence = await Geofence.findByIdAndDelete(req.params.id);
    if (!geofence) {
      return res.status(404).json({ error: 'Geofence not found' });
    }

    res.json({ message: 'Geofence deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
