const express = require('express');
const router = express.Router();
const authenticateJWT = require("../middlewares/authenticateJWT");
const {getUserById} = require("../services/userService");
require('dotenv').config();

router.get('/', authenticateJWT, async (req, res) => {
        const user = req.user;
        try {
            const profile = await getUserById(user.id);
            if (profile) {
                delete profile.password;
                res.status(200).json(profile);
            } else {
                res.sendStatus(404);
            }
        } catch (e){
            console.error(e);
            res.sendStatus(500);
        }
    },

    router.put('/:id', [authenticateJWT, urlencodedParser, addressValidation], async (req, res) => {
        const user = req.user;
        try {
            const address = await updateAddress({
                id: req.params.id,
                userId: user.id,
                address: req.body.address,
                apartments: req.body.apartments,
                fias: req.body.fias_code
            });

            res.status(200).json(address);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    })
);

module.exports = router;