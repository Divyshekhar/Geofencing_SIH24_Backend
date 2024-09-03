const cron = require('node-cron');
const Employee = require('./models/Employee'); // Adjust the path based on your structure
const moment = require('moment'); // For handling date and time calculations

// Schedule the cron job to run at midnight every day
cron.schedule('0 0 * * *', async () => {
    try {
        const employees = await Employee.find(); // Fetch all employees from the database
        for (const employee of employees) {
            // Assume employee has a method to calculate work hours
            const workHours = calculateWorkHours(employee); 
            employee.totalWorkHours += workHours;
            await employee.save(); // Save the updated work hours to the database
        }
        console.log('Work hours calculated and saved for all employees');
    } catch (error) {
        console.error('Error calculating work hours:', error);
    }
});

function calculateWorkHours(employee) {
    // Example logic to calculate work hours
    const checkInTime = moment(employee.checkInTime); // Assuming checkInTime is stored in employee data
    const checkOutTime = moment(employee.checkOutTime); // Assuming checkOutTime is stored in employee data
    return checkOutTime.diff(checkInTime, 'hours'); // Calculate difference in hours
}

module.exports = cron;
