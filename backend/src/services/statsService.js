module.exports = {
    getHistory: async (userId, addresses, counterTypes, counters) => {
        const pool = await require("../database/database").connectionPool;
        let query = 'SELECT c.name AS counter_name,\n' +
            'ct.name AS counter_type,\n' +
            'cv.registry_time AS registry_time,\n' +
            'cv.value AS value,\n' +
            '(SELECT IFNULL(rate, 0) AS rate FROM rate r\n' +
            'WHERE r.counter_type_id = ct.id AND r.date_begin <= cv.registry_time\n' +
            ' ORDER BY r.date_begin DESC LIMIT 1) AS rate,\n' +
            '       (SELECT IFNULL(rate, 0) AS rate\n' +
            '        FROM rate r\n' +
            '        WHERE r.counter_type_id = ct.id AND r.date_begin <= cv.registry_time\n' +
            '        ORDER BY r.date_begin DESC LIMIT 1) * (cv.value - (SELECT IFNULL(pcv.value, 0) AS rate\n' +
            '        FROM counter_values pcv\n' +
            '        WHERE pcv.counter_id = cv.counter_id AND pcv.registry_time < cv.registry_time\n' +
            '        ORDER BY pcv.registry_time DESC LIMIT 1)) AS summ\n' +
            'FROM counter_values cv\n' +
            'INNER JOIN counters c ON cv.counter_id = c.id AND c.user_id = ?\n' +
            'INNER JOIN counter_types ct on c.counter_type_id = ct.id';

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
        query += '\nORDER BY registry_time DESC, counter_type, counter_name'
        console.log(query);

        const [rows] = await pool.execute(
            query,
            params,
        );
        return rows;
    },

    getDynamic: async (userId, addresses, counterTypes, counters) => {
        const pool = await require("../database/database").connectionPool;
        let query = "SELECT ct.name AS counter_type,\n" +
            "       cv.registry_time,\n" +
            "       (SELECT IFNULL(rate, 0) AS rate\n" +
            "        FROM rate r\n" +
            "        WHERE r.counter_type_id = ct.id AND r.date_begin <= cv.registry_time\n" +
            "        ORDER BY r.date_begin DESC LIMIT 1) * (cv.value - (SELECT IFNULL(pcv.value, 0) AS rate\n" +
            "        FROM counter_values pcv\n" +
            "        WHERE pcv.counter_id = cv.counter_id AND pcv.registry_time < cv.registry_time\n" +
            "        ORDER BY pcv.registry_time DESC LIMIT 1)) AS summ\n" +
            "FROM counter_values cv\n" +
            "INNER JOIN counters c on cv.counter_id = c.id AND c.user_id = ?\n" +
            "INNER JOIN counter_types ct on c.counter_type_id = ct.id\n" +
            "WHERE registry_time BETWEEN adddate(now(), INTERVAL -1 YEAR ) AND now()";

        let params = [userId]

        let where = '';
        if (addresses) {
            where += `\nAND c.address_id IN (${addresses.join(',')})`;
        }

        if (counterTypes) {
            where += `\nAND c.counter_type_id IN (${counterTypes.join(',')})`;
        }
        if (counters) {
            where += `\nAND c.id IN (${counters.join(',')})`;
        }

        query += where;
        query += '\nORDER BY registry_time, counter_type'
        console.log(query);

        const [rows] = await pool.execute(
            query,
            params,
        );
        return rows;
    },
}
