const mysql2 = require("mysql2/promise");
const {migrateToV1} = require("./migrations/v1_migration");

require('dotenv').config();

const pool = mysql2.createPool({
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: 'Z',
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
});

const migrate = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute("SHOW TABLES LIKE 'version';");
        if (rows.length === 0) {
            await migrateToV1()
        }
    } finally {
        await connection.release();
    }
}

module.exports = {
    connectionPool: pool,
    migrate: migrate
};