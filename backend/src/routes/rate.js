const express = require('express');
const router = express.Router();
const authenticateJWT = require("../middlewares/authenticateJWT");
const {getRate, getRateById} = require("../services/rateService");


require('dotenv').config();

router.get('/', authenticateJWT, async (req, res) => {
        try {
            res.status(200).json(await getRate());
        } catch (e){
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

module.exports = router;