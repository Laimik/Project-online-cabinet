const express = require('express');
const router = express.Router();
const authenticateJWT = require("../middlewares/authenticateJWT");

const bodyParser = require("body-parser");
const {getDynamic} = require("../services/statsService");
const {getHistory} = require("../services/statsService");
const urlencodedParser = bodyParser.urlencoded({extended: false});

router.get('/history', authenticateJWT, async (req, res) => {
        const user = req.user;
        const addresses = req.query.addresses;
        const counterTypes = req.query.counter_types;
        const counters = req.query.counters;
        try {
            const counterValues = await getHistory(user.id, addresses, counterTypes, counters);
            res.status(200).json(counterValues);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }
)

router.get('/dynamic', authenticateJWT, async (req, res) => {
        const user = req.user;
        const addresses = req.query.addresses;
        const counterTypes = req.query.counter_types;
        const counters = req.query.counters;
        try {
            const raw = await getDynamic(user.id, addresses, counterTypes, counters);

            const uniqueDates = [...new Set(raw.map(item => item.registry_time.getTime()))];
            const series = [...new Set(raw.map(item => item.counter_type))];

            let chartData = {
                labels: uniqueDates.map(uniqueDate => new Date(uniqueDate)),
                datasets: series.map(single => { return {
                    label: single,
                    data: []
                }})
            }

            for (const uniqueDate of uniqueDates) {
                for (const dataset of chartData.datasets) {
                    const values = raw.filter(item =>
                        item.registry_time.getTime() === uniqueDate &&
                        item.counter_type === dataset.label);

                    let sum = values.reduce(function(total, item){
                        return total + item.summ;
                    }, 0);

                    dataset.data.push(sum);
                }
            }

            res.status(200).json(chartData);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }
)

module.exports = router;