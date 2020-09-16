module.exports = {
    getCounterValue: async(userId, counterId) => {
        const pool = await require("../database/database").getConnectionPool();
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT cv.*\n' +
                'FROM counter_values cv\n' +
                'INNER JOIN counters c ON cv.counter_id = c.id AND c.user_id = ?\n' +
                'WHERE cv.counter_id = ?',
                [userId, counterId],
            );
            return rows;
        } finally {
            connection.release();
        }
    },

    getCounterValueById: async(userId, counterId, id) => {
        const pool = await require("../database/database").getConnectionPool();
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT cv.*\n' +
                'FROM counter_values cv\n' +
                'INNER JOIN counters c ON cv.counter_id = c.id AND c.user_id = ?\n' +
                'WHERE cv.counter_id = ? AND cv.id = ?\n',
                [userId, counterId, id]
            );

            if (rows.length > 0) {
                return rows[0];
            } else {
                return undefined;
            }
        } finally {
            connection.release();
        }
    },

    createCounterValue: async(userId, counterId, registryTime, value) => {
        const pool = await require("../database/database").getConnectionPool();
        const connection = await pool.getConnection();
        try {
            await connection.query(
                "INSERT INTO counter_values (counter_id, registry_time, value) " +
                "VALUES (?,?,?)",
                [counterId, registryTime, value]);

            const [rows] = await connection.query("SELECT LAST_INSERT_ID() AS newId");
            const id = rows[0].newId;

            return await module.exports.getCounterValueById(userId, counterId, id);
        } finally {
            connection.release();
        }
    },

    updateCounterValue: async(userId, counterValue) => {
        const pool = await require("../database/database").getConnectionPool();
        const connection = await pool.getConnection();
        try {
            await connection.query(
                "UPDATE counter_values\n" +
                "SET counter_id = ?,\n" +
                " registry_time = ?,\n" +
                " value = ?\n" +
                " WHERE id = ? AND counter_id IN (SELECT id FROM counters WHERE user_id = ?)",
                [counterValue.counter_id, counterValue.registry_time, counterValue.value, counterValue.id, userId]
            );
            const [rows] = await connection.execute(
                'SELECT * FROM counter_values WHERE id = ?',
                [counterValue.id]
            );

            return rows[0];
        } finally {
            connection.release();
        }
    },

    deleteCounterValue: async(userId, counterId, id) => {
        const pool = await require("../database/database").getConnectionPool();
        const connection = await pool.getConnection();
        try {
            await pool.connection("DELETE FROM counter_values\n" +
                "WHERE id = ? AND counter_id IN (SELECT id FROM counters WHERE id = ? AND user_id = ?)",
                [id, counterId, userId]
            );
        } finally {
            connection.release();
        }
    }
}