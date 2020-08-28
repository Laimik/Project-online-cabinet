const express = require('express');
const router = express.Router();
const authenticateJWT = require("../middlewares/authenticateJWT");
require('dotenv').config();

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const { counterPostValidation, counterPutValidation} = require("../middlewares/counter_validation");
const { getCounters, getCounterById, createCounter, updateCounter, deleteCounter} = require("../services/counterService");

router.get('/', authenticateJWT, async (req, res) => {
        const user = req.user;
        try {
            res.status(200).json(await getCounters(user));
        } catch (e){
            console.error(e);
            res.sendStatus(500);
        }
    }
);

router.get('/:id', authenticateJWT, async (req, res) => {
        const id = req.params.id;
        const user = req.user;
        try {
            const counter = await getCounterById(user.id, id);
            if (counter) {
                res.status(200).json(counter);
            } else {
                res.sendStatus(404);
            }
        } catch (e){
            console.error(e);
            res.sendStatus(500);
        }
    }
);

router.post('/', [authenticateJWT, urlencodedParser, counterPostValidation], async (req, res) => {
        const user = req.user;
        const name = req.body.name;
        const addressId = req.body.address_id;
        const counterTypeId = req.body.counter_type_id;
        try {
            const counter = await createCounter(name, user.id, addressId, counterTypeId);

            res.status(200).json(counter);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }
);

router.put('/:id', [authenticateJWT, urlencodedParser, counterPutValidation], async (req, res) => {
    const user = req.user;
    try {
        const counter = await updateCounter({
            id: req.params.id,
            userId: user.id,
            name: req.body.name
        });
        res.status(200).json(counter);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
    const id = req.params.id
    const user = req.user;
    try {
        await deleteCounter(id, user.id);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

module.exports = router;