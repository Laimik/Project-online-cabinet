const express = require('express');
const router = express.Router();
const authenticateJWT = require("../middlewares/authenticateJWT");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const {profileValidation, passwordValidation} = require("../middlewares/profile_validation");
const {getUserById, updateUser} = require("../services/userService");
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

    router.put('/', [authenticateJWT, urlencodedParser, profileValidation], async (req, res) => {
        const user = req.user;
        try {
            const existingUser = await getUserById(user.id);
            existingUser.name = req.body.name;
            existingUser.email = req.body.email;
            existingUser.phoneNumber = req.body.phone_number;

            const profile = await updateUser(existingUser);
            delete profile.password;

            res.status(200).json(profile);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }),

    router.put('/change_password', [authenticateJWT, urlencodedParser, passwordValidation], async (req, res) => {
        const user = req.user;
        const password = req.body.password;
        try {
            const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
            const existingUser = await getUserById(user.id);
            existingUser.password = passwordHash;

            await updateUser(existingUser);

            res.sendStatus(200);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    })
);

module.exports = router;