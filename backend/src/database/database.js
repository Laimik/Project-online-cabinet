const mysql2 = require("mysql2/promise");
const {migrateToV1} = require("./migrations/v1_migration");

require('dotenv').config();

const getConnection = async () => {
    return mysql2.createPool({
        connectionLimit: 10,
        timezone: 'Z',
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
    });
}

const migrate = async () => {
    const pool = await getConnection();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute("SHOW TABLES LIKE 'version';");
        if (rows.length === 0) {
            await migrateToV1()
        }
    } finally {
        connection.release();
    }
}

module.exports = {
    getConnectionPool: getConnection,
    migrate: migrate
};