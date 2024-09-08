const db = require('../config/db');
const bcrypt = require('bcrypt');

// exports.createEmployee = async (req, res) => {
//     const { id, name, email, office_id } = req.body;

//     if (!id || !name || !email || !office_id) {
//         return res.status(400).json({ message: 'Name, email, and office_id are required' });
//     }

//     try {
//         // Insert the new employee into the database using Knex
//         const [newEmployeeId] = await db('employees')
//             .insert({ id, name, email, office_id });
//             // .returning('id');

//         res.status(201).json({
//             message: 'Employee created successfully',
//             employee: {
//                 id: newEmployeeId,
//                 name,
//                 email,
//                 office_id
//             }
//         });
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ message: error });
//     }
// };

exports.getEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await db('employees').where({ id }).first();
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    }
    catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, email, office_id } = req.body;
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
exports.getOfficeCoordinates = async (req, res) => {
    const { id } = req.params;  // Extract employeeId from request parameters

    try {
        const result = await db('employees')
            .join('offices', 'employees.office_id', 'offices.id')
            .select('offices.longitude', 'offices.latitude')
            .where('employees.id', id)
            .first();

        if (result) {
            // Send the longitude and latitude as the response
            return res.status(200).json({
                longitude: result.longitude,
                latitude: result.latitude
            });
        } else {
            return res.status(404).json({ message: 'Employee or office not found' });
        }
    } catch (error) {
        // Handle the error and return a 500 response with the error message
        console.error('Error retrieving office coordinates:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
exports.allEmployee = async (req, res) => {
    try {
        // Fetch all employees from the 'employees' table
        const employees = await db('employees').select('*');

        // If employees are found, return them in the response
        if (employees.length > 0) {
            return res.status(200).json(employees);
        } else {
            // If no employees are found, return a 404 status
            return res.status(404).json({ message: 'No employees found' });
        }
    } catch (error) {
        // Log the error and return a 500 status with the error message
        console.error('Error retrieving employees:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

exports.createEmployeeWithPassword = async (req, res) => {
    const { name, email, office_id, password } = req.body;

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

        // Insert employee details into employees table and get the generated ID
        const [employee] = await db('employees')
            .insert({
                name,
                email,
                office_id
            })
            .returning('id'); // This returns an array, so destructure the first element

        const employeeId = employee.id || employee;  // Handle both cases, depending on Knex version

        // Insert hashed password into user_credentials table with the employee_id
        await db('user_credentials').insert({
            employee_id: employeeId,
            password: hashedPassword
        });

        res.status(201).json({ message: 'Employee and password created successfully', employeeId });
    } catch (error) {
        console.error('Error creating employee with password:', error);
        res.status(500).json({
            message: 'Error creating employee with password',
            error: error.message
        });
    }
};


exports.verifyPassword = async (req, res) => {
    const { id } = req.params;  // Extract employeeId from the request parameters
    const { password } = req.body;  // Extract input password from the request body

    try {
        // Get the hashed password from user_credentials for the given employee_id
        const userCredential = await db('user_credentials')
            .select('password')
            .where('employee_id', id)
            .first();

        if (!userCredential) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hashedPassword = userCredential.password;

        // Check if the hashed password is retrieved properly
        if (!hashedPassword) {
            throw new Error('Hashed password not found');
        }

        // Compare the input password with the hashed password
        const isMatch = await bcrypt.compare(password, hashedPassword);

        if (isMatch) {
            return res.status(200).json({ message: 'Sign-in successful' });
        } else {
            return res.status(401).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};


