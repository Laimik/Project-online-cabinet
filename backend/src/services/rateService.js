module.exports = {
    getRate: async () => {
        const pool = await require("../database/database").getConnectionPool();
        const [rows] = await pool.execute(
            'SELECT * FROM rate',
            []
        );
        return rows;
    },

    getRateById: async (rateId) => {
        const pool = await require("../database/database").getConnectionPool();
        const [rows] = await pool.execute(
            'SELECT * FROM rate WHERE id = ?',
            [rateId]
        );
        if (rows.length > 0) {
            return rows[0];
        } else {
            return undefined;
        }
    }
}

