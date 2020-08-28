module.exports.profileValidation = profileValidation = (req, res, next) => {
    const name = req.body.name;
    if (!name) {
        return res.status(422).json({message: "name field is required"})
    }

    const email = req.body.email;
    if (!email) {
        return res.status(422).json({message: "email field is required"})
    }

    const phoneNumber = req.body.phone_number;
    if (!phoneNumber) {
        return res.status(422).json({message: "phone number field is required"})
    }

    next();
}

module.exports.passwordChangeValidation = passwordChangeValidation = (req, res, next) => {

    const password = req.body.password;
    if (!password) {
        return res.status(422).json({message: "password field is required"})
    }

    next();
}