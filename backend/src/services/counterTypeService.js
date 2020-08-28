module.exports = {
    getCounterType: async () => {
        const pool = await require("../database/database").getConnectionPool();
        const [rows] = await pool.execute(
            'SELECT * FROM counter_types',
            []
        );
        return rows;
    },

    getCounterTypeById: async (counterTypeId) => {
        const pool = await require("../database/database").getConnectionPool();
        const [rows] = await pool.execute(
            'SELECT * FROM counter_types WHERE id = ?',
            [counterTypeId]
        );
        if (rows.length > 0) {
            return rows[0];
        } else {
            return undefined;
        }
    }
}
