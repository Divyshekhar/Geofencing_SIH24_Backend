const knex = require('knex');
const dotenv = require('dotenv');
dotenv.config();

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATA
    }
});

async function setTimezone() {
    try {
        await db.raw('SET timezone = "Asia/Kolkata"');
        console.log('Timezone set to IST');
    } catch (error) {
        console.error('Error setting timezone:', error);
    }
}
setTimezone();

module.exports = db;
