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

            const labels = [];
            const series = [];
            for (const item of raw) {
                if (!labels.find(label => label === item.registry_time)) {
                    console.log(labels);
                    console.log(item.registry_time);
                    labels.push(item.registry_time);
                }

                if (!series.includes(item.counter_type)) {
                    series.push(item.counter_type)
                }
            }

            let chartData = {
                labels: labels,
                datasets: series.map(single => { return {
                    label: single,
                    data: []
                }})
            }

            for (const label of chartData.labels) {
                for (const dataset of chartData.datasets) {
                    const values = raw.filter(item =>
                        item.registry_time === label &&
                        raw.counter_type === dataset.label);

                    let sum = values.reduce(function(a, b){
                        return a.summ + b.summ;
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