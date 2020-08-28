const express = require('express');
const router = express.Router();
const authenticateJWT = require("../middlewares/authenticateJWT");
const {getCounterType, getCounterTypeById} = require("../services/counterTypeService");
require('dotenv').config();

router.get('/', authenticateJWT, async (req, res) => {
        try {
            res.status(200).json(await getCounterType());
        } catch (e){
            console.error(e);
            res.sendStatus(500);
        }
    }
);

router.get('/:id', authenticateJWT, async (req, res) => {
        const id = req.params.id
        try {
            const counterType = await getCounterTypeById(id);
            if (counterType) {
                res.status(200).json(counterType);
            } else {
                res.sendStatus(404);
            }
        } catch (e){
            console.error(e);
            res.sendStatus(500);
        }
    }
);


module.exports = router;