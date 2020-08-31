const express = require('express');
const authenticateJWT = require("../middlewares/authenticateJWT");
const router = express.Router({ mergeParams: true });
require('dotenv').config();

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const counterValueValidation = require("../middlewares/coutner_values_validation");
const {getCounterById} = require("../services/counterService");
const {getCounterValue, getCounterValueById, createCounterValue, updateCounterValue, deleteCounterValue} = require("../services/counterValueService");

router.get('/', authenticateJWT, async (req, res) => {
    const counterId = req.params.counter_id;
    const user = req.user;
    try {
        res.status(200).json(await getCounterValue(user.id, counterId));
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

        const counterValues = await getCounterValueById(user.id, counterId, id);
        if (counterValues) {
            res.status(200).json(counterValues);
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
    const registryTime = req.body.registry_time;
    const value = req.body.value;
    const user = req.user;

    try {
        const counter = await getCounterById(user.id, counterId);
        if (counter){
            const counterValue = await createCounterValue(user.id, counterId, registryTime, value);
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