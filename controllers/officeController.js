const db = require('../config/db');

exports.getOfficeData = async (req, res) => {
  try {
      const query = 'SELECT longitude, latitude, radius FROM offices WHERE id = $1';
      const values = [req.params.id]; //passing ID of specific office

      const result = await db.query(query, values);

      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Geofence not found' });
      }

      const geofenceData = result.rows[0];
      res.status(200).json(geofenceData);
  } catch (error) {
      console.error('Error fetching geofence data:', error);
      res.status(500).json({ error: 'Failed to fetch geofence data' });
  }
};
//-----------------------------------------------------------------------------
// exports.getGeofences = async (req, res) => {
//   try {
//     const geofences = await Geofence.find();
//     res.json(geofences);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// exports.getGeofence = async (req, res) => {
//   try {
//     const geofence = await Geofence.findById(req.params.id);
//     if (!geofence) {
//       return res.status(404).json({ error: 'Geofence not found' });
//     }
//     res.json(geofence);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// exports.updateGeofence = async (req, res) => {
//   const { name, latitude, longitude, radius } = req.body;

//   try {
//     const geofence = await Geofence.findByIdAndUpdate(
//       req.params.id,
//       { name, latitude, longitude, radius },
//       { new: true }
//     );

//     if (!geofence) {
//       return res.status(404).json({ error: 'Geofence not found' });
//     }

//     res.json(geofence);
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// exports.deleteGeofence = async (req, res) => {
//   try {
//     const geofence = await Geofence.findByIdAndDelete(req.params.id);
//     if (!geofence) {
//       return res.status(404).json({ error: 'Geofence not found' });
//     }

//     res.json({ message: 'Geofence deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };
