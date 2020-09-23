const express = require('express');
const authenticateJWT = require("../middlewares/authenticateJWT");
const router = express.Router({ mergeParams: true });
require('dotenv').config();
const moment = require('moment');

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const counterValueValidation = require("../middlewares/coutner_values_validation");
const {getCounterById} = require("../services/counterService");
const {getCounterValues, getCounterValueById, createCounterValue, updateCounterValue, deleteCounterValue} = require("../services/counterValueService");

router.get('/', authenticateJWT, async (req, res) => {
    const user = req.user;
    const addresses = req.query.addresses;
    const counterTypes = req.query.counter_types;
    const counters = req.query.counters;
    console.log(req.query);
    try {
        const counterValues = await getCounterValues(user.id, addresses, counterTypes, counters);
        for (const counterValue of counterValues) {
            if (moment(counterValue.registry_time).isSame(moment(), 'day')) {
                counterValue.current = true;
            }
        }
        res.status(200).json(counterValues);
    } catch (e){
        console.error(e);
        res.sendStatus(500);
    }
});

router.get('/:id', authenticateJWT, async (req, res) => {
    const id = req.params.id
    const user = req.user;
    try {
        const counterValue = await getCounterValueById(user.id, id);
        if (counterValue) {
            res.status(200).json(counterValue);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.post('/', [authenticateJWT, urlencodedParser, counterValueValidation], async (req, res) => {
    const counterId = req.body.counter_id;
    const value = req.body.value;
    const user = req.user;

    try {
        const counter = await getCounterById(user.id);
        if (counter){
            const counterValue = await createCounterValue(user.id, counterId, new Date(), value);
            res.status(200).json(counterValue);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.put('/:id', [authenticateJWT, urlencodedParser, counterValueValidation], async (req, res) => {
    const user = req.user;
    try {
        const counterValue = await updateCounterValue({
            id: req.params.id,
            userId: user.id,
            counterId: req.body.counter_id,
            registryTime: req.body.registry_time,
            value: req.body.value
        });
        res.status(200).json(counterValue);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
    const id = req.params.id
    const user = req.user;
    try {
        await deleteCounterValue(user.id, id);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

module.exports = router;