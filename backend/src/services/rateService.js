module.exports = {
    // where: [
    //   dateBeginLte: date
    // ],
    // orderBy : [
    //   {
    //     field: string
    //     desc: bool
    //   }
    //   ...
    // ]
    getRates: async (options) => {
        const pool = await require("../database/database").getConnectionPool();
        let query = 'SELECT * FROM rate\n';
        const args = [];

        if (options) {
            if (options.where) {
                let where = 'WHERE ';
                if (options.where.dateBeginLte) {
                    where += 'date_begin <= ?\n';
                    args.push(options.where.dateBeginLte);
                }

                query += where;
            }

            if (options.orderBy) {
                let orderBy = 'ORDER BY ';
                for (let i = 0; i < options.orderBy.length; i++) {
                    const orderByItem = options.orderBy[i];
                    if (i > 0) orderBy += ', ';
                    orderBy += `${orderByItem.field} ${orderByItem.desc ? 'DESC' : ''}`;
                }

                query += orderBy;
            }

            console.log(query);
        }

        const [rows] = await pool.execute(
            query,
            args
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
    },

    createRate: async(rate, counterTypeId, dateBegin) => {
        const pool = await require("../database/database").getConnectionPool();
        await pool.query(
            "INSERT INTO rate (rate, counter_type_id, date_begin)" +
            " VALUES (?,?,?)",
            [rate, counterTypeId, dateBegin]);

        const [rows] = await pool.query("SELECT LAST_INSERT_ID() AS newId");
        const id = rows[0].newId;

        return await module.exports.getRateById(id);
    },

    updateRate: async(rate) => {
        const pool = await require("../database/database").getConnectionPool();
        await pool.query(
            "UPDATE rate SET rate = ?, counter_type_id = ?, date_begin = ? WHERE id = ?",
            [rate.rate, rate.counterTypeId, rate.dateBegin, rate.id]
        );
        const [rows] = await pool.execute(
            'SELECT * FROM rate WHERE id = ?',
            [rate.id]
        );

        return rows[0];
    },

    deleteRate: async(rateId) => {
        const pool = await require("../database/database").getConnectionPool();
        await pool.query(
            "DELETE FROM counters WHERE id = ?",
            [rateId]
        );
    }
}




