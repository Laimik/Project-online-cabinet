const express = require('express');
const router = express.Router();
require('dotenv').config();

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { signInValidation, signUpValidation} = require("../middlewares/auth_validation");
const {getUserByEmail, createUser} = require("../services/userService");


router.post("/sign_up", [urlencodedParser, signUpValidation], async function (req, res) {
  if(!req.body) return res.sendStatus(400);
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const number = req.body.phone_number;

  try {
    const user = await getUserByEmail(email);
    if (user) {
      res.sendStatus(302);
    } else {
      const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
      await createUser(name, email, passwordHash, number);
      res.sendStatus(200);
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post("/sign_in", [ urlencodedParser, signInValidation ], async function (req, res) {
  if(!req.body) return res.sendStatus(400);
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await getUserByEmail(email);
    if (user) {
      if (await bcrypt.compare(password, user.password)){
        const accessToken = jwt.sign({
          id: user.id,
          name: user.name,
          email: user.email
        }, process.env.JWT_SECRET);

        res.status(200).json({ accessToken });
      }
      else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }

  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
