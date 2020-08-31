module.exports = {
    getAddresses: async(userId) => {
        const pool = await require("../database/database").getConnectionPool();
        const [rows] = await pool.execute(
            'SELECT * FROM addresses WHERE user_id = ?',
            [userId]
        );
        return rows;
    },

    getAddressById: async(userId, addressId) => {
        const pool = await require("../database/database").getConnectionPool();
        const [rows] = await pool.execute(
            'SELECT * FROM addresses WHERE user_id = ? AND id = ?',
            [userId, addressId]
        );

        if (rows.length > 0) {
            return rows[0];
        } else {
            return undefined;
        }
    },

    createAddress: async(userId, address, apartments, fias) => {
        const pool = await require("../database/database").getConnectionPool();
        await pool.query(
            "INSERT INTO addresses (user_id, address, apartments, fias_code) " +
            "VALUES (?,?,?,?)",
            [userId, address, apartments, fias]);

        const [rows] = await pool.query("SELECT LAST_INSERT_ID() AS newId");
        const id = rows[0].newId;

        return await module.exports.getAddressById(userId, id);
    },

    updateAddress: async(address) => {
        const pool = await require("../database/database").getConnectionPool();
        await pool.query(
            "UPDATE addresses SET address = ?, apartments = ?, fias_code = ? WHERE id = ? AND user_id = ?",
            [address.address, address.apartments, address.fias, address.id, address.userId]
        );
        const [rows] = await pool.execute(
            'SELECT * FROM addresses WHERE id = ?',
            [address.id]
        );

        return rows[0];
    },

    deleteAddresses: async(addressId, userId) => {
        const pool = await require("../database/database").getConnectionPool();
        await pool.query(
            "DELETE FROM addresses WHERE id = ? AND user_id = ?",
            [addressId, userId]
        );
    }
}