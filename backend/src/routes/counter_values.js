const express = require('express');
const authenticateJWT = require("../middlewares/authenticateJWT");
const router = express.Router({ mergeParams: true });
require('dotenv').config();
const moment = require('moment');

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const counterValueValidation = require("../middlewares/coutner_values_validation");
const {getCounterById} = require("../services/counterService");
const {getCounterValue, getCounterValueById, createCounterValue, updateCounterValue, deleteCounterValue} = require("../services/counterValueService");

router.get('/', authenticateJWT, async (req, res) => {
    const counterId = req.params.counter_id;
    const user = req.user;
    try {
        const counterValues = await getCounterValue(user.id, counterId);
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
    const counterId = req.params.counter_id;
    const id = req.params.id
    const user = req.user;
    try {
        const counterValue = await getCounterValueById(user.id, counterId, id);
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
    const counterId = req.params.counter_id;
    const value = req.body.value;
    const user = req.user;

    try {
        const counter = await getCounterById(user.id, counterId);
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
            counterId: req.params.counter_id,
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
    const counterId = req.params.counter_id;
    const id = req.params.id
    const user = req.user;
    try {
        await deleteCounterValue(user.id, counterId, id);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

module.exports = router;