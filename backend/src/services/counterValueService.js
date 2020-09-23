module.exports = {
    getCounterValues: async(userId, addresses, counterTypes, counters) => {
        const pool = await require("../database/database").connectionPool;
        let query = 'SELECT cv.*\n' +
            'FROM counter_values cv\n' +
            'INNER JOIN counters c ON cv.counter_id = c.id AND c.user_id = ?';

        let params = [userId]

        let where = '';
        if (addresses) {
            where += `\nWHERE c.address_id IN (${addresses.join(',')})`;
        }

        if (counterTypes) {
            where += where ? `\nAND c.counter_type_id IN (${counterTypes.join(',')})`
                : `\nWHERE c.counter_type_id IN (${counterTypes.join(',')})`;
        }
        if (counters) {
            where += where ? `\nAND c.id IN (${counters.join(',')})`
                : `\nWHERE c.id IN (${counters.join(',')})`;
        }

        query += where;
        console.log(query);

        const [rows] = await pool.execute(
            query,
            params,
        );
        return rows;
    },

    getCounterValueById: async(userId, id) => {
        const pool = await require("../database/database").connectionPool;
        const [rows] = await pool.execute(
            'SELECT cv.*\n' +
            'FROM counter_values cv\n' +
            'INNER JOIN counters c ON cv.counter_id = c.id AND c.user_id = ?\n' +
            'WHERE cv.id = ?\n',
            [userId, id]
        );

        if (rows.length > 0) {
            return rows[0];
        } else {
            return undefined;
        }
    },

    createCounterValue: async(userId, counterId, registryTime, value) => {
        const pool = await require("../database/database").connectionPool;
        await pool.query(
            "INSERT INTO counter_values (counter_id, registry_time, value) " +
            "VALUES (?,?,?)",
            [counterId, registryTime, value]);

        const [rows] = await pool.query("SELECT LAST_INSERT_ID() AS newId");
        const id = rows[0].newId;

        return await module.exports.getCounterValueById(userId, counterId, id);
    },

    updateCounterValue: async(userId, counterValue) => {
        const pool = await require("../database/database").connectionPool;
        await pool.query(
            "UPDATE counter_values\n" +
            "SET counter_id = ?,\n" +
            " registry_time = ?,\n" +
            " value = ?\n" +
            " WHERE id = ? AND counter_id IN (SELECT id FROM counters WHERE user_id = ?)",
            [counterValue.counter_id, counterValue.registry_time, counterValue.value, counterValue.id, userId]
        );
        const [rows] = await pool.execute(
            'SELECT * FROM counter_values WHERE id = ?',
            [counterValue.id]
        );

        return rows[0];
    },

    deleteCounterValue: async(userId, id) => {
        const pool = await require("../database/database").connectionPool;
        await pool.connection("DELETE FROM counter_values\n" +
            "WHERE id IN (SELECT id FROM counters WHERE id = ? AND user_id = ?)",
            [id, userId]
        );
    }
}