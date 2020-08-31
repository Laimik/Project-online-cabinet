module.exports = {
    getCounterValue: async(userId, counterId) => {
        const pool = await require("../database/database").getConnectionPool();
        const [rows] = await pool.execute(
            'SELECT cv.*\n' +
            'FROM counter_values cv\n' +
            'INNER JOIN counters c ON cv.counter_id = c.id AND c.user_id = ?\n' +
            'WHERE cv.counter_id = ?',
            [userId, counterId],
            );
        return rows;
    },

    getCounterValueById: async(userId, counterId, id) => {
        const pool = await require("../database/database").getConnectionPool();
        const [rows] = await pool.execute(
            'SELECT cv.*\n' +
            'FROM counter_values cv\n' +
            'INNER JOIN counters c ON cv.counter_id = c.id AND c.user_id = ?\n' +
            'WHERE cv.counter_id = ? AND cv.id = ?\n',
            [userId, counterId, id ]
        );

        if (rows.length > 0) {
            return rows[0];
        } else {
            return undefined;
        }
    },

    createCounterValue: async(userId, counterId, registryTime, value) => {
        const pool = await require("../database/database").getConnectionPool();
        await pool.query(
            "INSERT INTO counter_values (counter_id, registry_time, value) " +
            "VALUES (?,?,?)",
            [counterId, registryTime, value]);

        const [rows] = await pool.query("SELECT LAST_INSERT_ID() AS newId");
        const id = rows[0].newId;

        return await module.exports.getCounterValueById(userId, counterId, id);
    },

    updateCounterValue: async(counterValue) => {
        const pool = await require("../database/database").getConnectionPool();
        await pool.query(
            "UPDATE counter_values\n" +
            "SET counter_id = ?,\n" +
            " registry_time = ?,\n" +
            " value = ?\n" +
            " WHERE id = ? AND counter_id IN (SELECT id FROM counters WHERE user_id = ?)",
            [counterValue.counterId, counterValue.registryTime, counterValue.value, counterValue.id, counterValue.userId]
        );
        const [rows] = await pool.execute(
            'SELECT * FROM counter_values WHERE id = ?',
            [counterValue.id]
        );

        return rows[0];
    },

    deleteCounterValue: async(userId, counterId, id) => {
        const pool = await require("../database/database").getConnectionPool();
        await pool.query("DELETE FROM counter_values\n" +
            "WHERE id = ? AND counter_id IN (SELECT id FROM counters WHERE id = ? AND user_id = ?)",
            [id, counterId, userId]
        );
    }
}