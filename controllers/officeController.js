const db = require('../config/db');

exports.createOffice = async (req, res) => {
    const { name, longitude, latitude, radius } = req.body;
    if (!name || !latitude || !longitude || !radius) {
        return res.status(400).json({ message: 'Name, latitude, longitude and radius are required' });
    }
    try {
        // Insert the new office into the database using Knex
        const [newOfficeId] = await db('offices')
            .insert({ name, longitude, latitude, radius })
            .returning('id');

        res.status(201).json({
            message: 'Office created successfully',
            office: {
                id: newOfficeId,
                name,
                longitude,
                latitude,
                radius
            }
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: error });
    }
};

exports.getOffice = async (req, res) => {
    const { id } = req.params;
    try {
        const office = await db('offices').where({ id }).first();
        if (!office) {
            return res.status(404).json({ message: 'Office not found' });
        }
        res.status(200).json(office);
    }
    catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateOffice = async (req, res) => {
    const { id } = req.params;
    const { name, longitude, latitude, radius } = req.body;
    try {
        const [updatedOffice] = await db('offices')
            .where({ id })
            .update({ name, longitude, latitude, radius })
            .returning('*');

        if (!updatedOffice) {
            return res.status(404).json({ message: 'Office not found' });
        }

        res.status(200).json(updatedOffice);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.deleteOffice = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOffice = await db('offices').where({ id }).del();

        if (deletedOffice === 0) {
            return res.status(404).json({ message: 'Office not found' });
        }

        res.status(200).json({ message: 'Office deleted successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.getAll = async(req, res) => {
    try{
        const result = await db('offices').select('*');

        if(result.length > 0){
            return res.status(200).json(result);
        }
        else {
            return res.status(404).json({ message: 'No offices found' });
        }
    } catch(error){
    console.error('Error retrieving offices:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

