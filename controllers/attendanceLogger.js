const logAttendance = async (employee_id, status) => {
    const query = `
        INSERT INTO attendance_logs (employee_id, status)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const values = [employee_id, status];
    const res = await pool.query(query, values);
    return res.rows[0];
};
module.exports = logAttendance;