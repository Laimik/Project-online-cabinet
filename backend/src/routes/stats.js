const express = require('express');
const router = express.Router();
const authenticateJWT = require("../middlewares/authenticateJWT");

const bodyParser = require("body-parser");
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

module.exports = router;