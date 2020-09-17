const express = require('express');
const router = express.Router();
const authenticateJWT = require("../middlewares/authenticateJWT");
const {getRates, getRateById, createRate, updateRate, deleteRate} = require("../services/rateService");

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});

require('dotenv').config();

router.get('/', authenticateJWT, async (req, res) => {
        try {
            res.status(200).json(await getRates());
        } catch (e){
            console.error(e);
            res.sendStatus(500);
        }
    }
);

router.get('/current', authenticateJWT, async (req, res) => {
        try {
            const rates = await getRates(
                {
                    where: {
                        dateBeginLte: new Date()
                    },
                    orderBy: [
                        {
                            field: 'date_begin',
                            desc: true
                        }
                    ]
                });

            const currentRates = [];
            for (const rate of rates) {
                let alreadyExist = false;
                for (const currentRate of currentRates) {
                    if (currentRate.counter_type_id === rate.counter_type_id) {
                        alreadyExist = true;
                        break
                    }
                }

                if (!alreadyExist) {
                    currentRates.push(rate);
                }
            }

            res.status(200).json(currentRates);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }
);

router.get('/:id', authenticateJWT, async (req, res) => {
        const id = req.params.id
        try {
            const rateType = await getRateById(id);
            if (rateType) {
                res.status(200).json(rateType);
            } else {
                res.sendStatus(404);
            }
        } catch (e){
            console.error(e);
            res.sendStatus(500);
        }
    }
);

router.post('/', [authenticateJWT, urlencodedParser,], async (req, res) => {
        const rate = req.body.rate;
        const counterTypeId = req.body.counter_type_id;
        const dateBegin = req.body.date_begin;
        try {
            const newRate = await createRate(rate, counterTypeId, dateBegin);

            res.status(200).json(newRate);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }
);

router.put('/:id', [authenticateJWT, urlencodedParser,], async (req, res) => {
    try {
        const rate = await updateRate({
            id: req.params.id,
            rate:  req.body.rate,
            counterTypeId: req.body.counter_type_id,
            dateBegin: req.body.date_begin
        });
        res.status(200).json(rate);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
    const id = req.params.id
    try {
        await deleteRate(id);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

module.exports = router;