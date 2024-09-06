const db = require('../config/db');

exports.createEmployee = async (req, res) => {
    const { name, email, office_id } = req.body;

    if (!name || !email || !office_id) {
        return res.status(400).json({ message: 'Name, email, and office_id are required' });
    }

    try {
        // Insert the new employee into the database using Knex
        const [newEmployeeId] = await db('employees')
            .insert({ name, email, office_id })
            .returning('id');

        res.status(201).json({
            message: 'Employee created successfully',
            employee: {
                id: newEmployeeId,
                name,
                email,
                office_id
            }
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: error });
    }
};

exports.getEmployee = async (req, res) => {
    const {id} = req.params;

    try{
        const employee = await db('employees').where({id}).first();
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    }
    catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error'});
    }
};

exports.updateEmployee = async(req, res) => {
    const {id} = req.params;
    const{name, email, office_id} = req.body;
    try {
        const updatedEmployee = await db('employees')
            .where({ id })
            .update({ name, email, office_id })
            .returning('*');

        if (!updatedEmployee.length) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedEmployee = await db('employees').where({ id }).del();

        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

