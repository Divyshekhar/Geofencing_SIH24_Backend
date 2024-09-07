const db = require('../config/db');


exports.markLogs = async (req, res) => {
    const { employee_id, state } = req.body;

    if (!employee_id || !state) {
        return res.status(400).json({ message: 'Employee ID and state are required' });
    }

    if (state !== 'IN' && state !== 'OUT') {
        return res.status(400).json({ message: 'State must be "IN" or "OUT"' });
    }

    try {
        if (state === 'IN') {
            // Check if there's an existing 'IN' log without a corresponding 'OUT'
            const lastInLog = await db('attendance_logs')
                .where({ employee_id, state: 'IN' })
                .andWhere(function() {
                    this.whereNull('pair_id');
                })
                .orderBy('timestamp', 'desc')
                .first();

            // If there's already an 'IN' log without a corresponding 'OUT', return an error
            if (lastInLog) {
                return res.status(400).json({ message: "Employee already logged 'IN' without an 'OUT'" });
            }

            // Insert a new 'IN' log
            const [newLog] = await db('attendance_logs')
                .insert({
                    employee_id,
                    state,
                    timestamp: new Date(),
                })
                .returning('*'); // Return the newly inserted record

            res.status(201).json(newLog);
        } else if (state === 'OUT') {
            // Find the most recent 'IN' log without a corresponding 'OUT'
            const lastInLog = await db('attendance_logs')
                .where({ employee_id, state: 'IN' })
                .andWhere(function() {
                    this.whereNull('pair_id');
                })
                .orderBy('timestamp', 'desc')
                .first();

            if (!lastInLog) {
                return res.status(400).json({ message: 'No matching "IN" log found for this employee' });
            }

            // Insert the 'OUT' log with the same pair_id as the corresponding 'IN' log
            const [newOutLog] = await db('attendance_logs')
                .insert({
                    employee_id,
                    state,
                    timestamp: new Date(),
                    pair_id: lastInLog.id, // Link the 'OUT' log to the corresponding 'IN' log
                })
                .returning('*');

            // Update the 'pair_id' in the corresponding 'IN' log
            await db('attendance_logs')
                .where({ id: lastInLog.id })
                .update({
                    pair_id: lastInLog.id,
                    updated_at: new Date(),
                });

            res.status(200).json(newOutLog);
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.calculateTotalWorkingHours = async (req, res) => {
    try {
        // Query to select all necessary records from attendance_logs
        const logs = await db('attendance_logs')
            .select('employee_id', 'timestamp', 'state', 'pair_id')
            .whereIn('state', ['IN', 'OUT'])
            .orderBy('timestamp', 'asc');

        // Calculate total working hours for each employee
        const employeeHours = {};
        logs.forEach(log => {
            const { employee_id, timestamp, state } = log;
            const currentTime = new Date(timestamp);

            // Initialize the employee record if not present
            if (!employeeHours[employee_id]) {
                employeeHours[employee_id] = { totalHours: 0, lastInTime: null };
            }

            if (state === 'IN') {
                employeeHours[employee_id].created_at = currentTime;
            } else if (state === 'OUT') {
                if (employeeHours[employee_id].created_at) {
                    const durationInMillis = currentTime - employeeHours[employee_id].created_at;
                    const durationInHours = durationInMillis / (1000 * 60 * 60); // Convert to hours

                    // Debugging: Log details
                    console.log(`Employee ID: ${employee_id}`);
                    console.log(`State: ${state}`);
                    console.log(`Current Time: ${currentTime}`);
                    console.log(`Last IN Time: ${employeeHours[employee_id].created_at}`);
                    console.log(`Duration In Millis: ${durationInMillis}`);
                    console.log(`Duration In Hours: ${durationInHours}`);

                    employeeHours[employee_id].totalHours += durationInHours;
                    employeeHours[employee_id].created_at = null; // Reset lastInTime after calculating
                }
            }
        });
        const formatInterval = (hours) => {
            const totalSeconds = Math.round(hours * 3600);
            const hoursPart = Math.floor(totalSeconds / 3600);
            const minutesPart = Math.floor((totalSeconds % 3600) / 60);
            const secondsPart = totalSeconds % 60;
            return `${hoursPart} hours ${minutesPart} minutes ${secondsPart} seconds`;
        };

        // Insert or update the total working hours in the database
        const date = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
        const queries = Object.entries(employeeHours).map(([employee_id, { totalHours }]) => {
            return db.raw(`
                INSERT INTO total_working_hours (date, employee_id, total_hours)
                VALUES (?, ?, ?)
                ON CONFLICT (employee_id, date)
                DO UPDATE
                SET total_hours = total_working_hours.total_hours + EXCLUDED.total_hours
            `, [date, employee_id, formatInterval(totalHours)]);
        });

        await Promise.all(queries);

        res.status(200).json({ message: 'Total working hours calculated and updated successfully' });
    } catch (error) {
        console.error('Error calculating total working hours:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.allAttendance = async(req, res) => {
    try{
        const result = await db('attendance_logs').select('*');

        if(result.length > 0){
            return res.status(200).json(result);
        }
        else {
            return res.status(404).json({ message: 'No attendance found' });
        }
    } catch(error){
    console.error('Error retrieving attendance:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};exports.allHourlyAttendance = async(req, res) => {
    try{
        const result = await db('total_working_hours').select('*');

        if(result.length > 0){
            return res.status(200).json(result);
        }
        else {
            return res.status(404).json({ message: 'No attendance found' });
        }
    } catch(error){
    console.error('Error retrieving attendance:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};