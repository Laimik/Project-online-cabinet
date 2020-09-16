module.exports = {
    getCounterType: async () => {
        const pool = await require("../database/database").getConnectionPool();
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM counter_types',
                []
            );
            return rows;
        } finally {
            connection.release();
        }
    },

    getCounterTypeById: async (counterTypeId) => {
        const pool = await require("../database/database").getConnectionPool();
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM counter_types WHERE id = ?',
                [counterTypeId]
            );
            if (rows.length > 0) {
                return rows[0];
            } else {
                return undefined;
            }
        } finally {
            connection.release();
        }
    }
}
