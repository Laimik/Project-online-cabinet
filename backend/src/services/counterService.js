module.exports = {
    getCounters: async(userId) => {
        const pool = await require("../database/database").getConnectionPool();
        const [rows] = await pool.execute(
            'SELECT * FROM counters WHERE user_id = ?',
            [userId]
        );

        return rows;
    },

    getCounterById: async(userId, counterId) => {
        const pool = await require("../database/database").getConnectionPool();
        const [rows] = await pool.execute(
            'SELECT * FROM counters WHERE user_id = ? AND id = ?',
            [userId, counterId]
        );

        if (rows.length > 0) {
            return rows[0];
        } else {
            return undefined;
        }
    },

    createCounter: async(name, userId, addressId, counterTypeId) => {
        const pool = await require("../database/database").getConnectionPool();
        await pool.query(
            "INSERT INTO counters (name, user_id, address_id, counter_type_id)" +
            " VALUES (?,?,?,?)",
            [name, userId, addressId, counterTypeId]);

        const [rows] = await pool.query("SELECT LAST_INSERT_ID() AS newId");
        const id = rows[0].newId;

        return await module.exports.getCounterById(userId, id);
    },

    updateCounter: async(counter) => {
        const pool = await require("../database/database").getConnectionPool();
        await pool.query(
            "UPDATE counters SET name = ? WHERE id = ?",
            [counter.name, counter.id, counter.userId]);

        const [rows] = await pool.execute(
            'SELECT * FROM counters WHERE id = ?',
            [counter.id]
        );

        return rows[0];
    },

    deleteCounter: async(counterId, userId) => {
        const pool = await require("../database/database").getConnectionPool();
        await pool.query(
                "DELETE FROM counters WHERE id = ? AND user_id = ?",
                [counterId, userId]
        );
    }
}