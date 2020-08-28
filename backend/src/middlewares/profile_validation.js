module.exports.profileValidation = profileValidation = (req, res, next) => {
    const name = req.body.name;
    if (!name) {
        return res.status(422).json({message: "name field is required"})
    }

    const email = req.body.email;
    if (!email) {
        return res.status(422).json({message: "email field is required"})
    } else {
        let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (!re.test(String(email).toLowerCase())){
            return res.status(422).json({message: "invalid email"})
        }
    }

    const phoneNumber = req.body.phone_number;
    if (!phoneNumber) {
        return res.status(422).json({message: "phone number field is required"})
    } else {
        let re = /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/;
        if (!re.test(String(phoneNumber).toLowerCase())){
            return res.status(422).json({message: "invalid phone number"})
        }
    }

    next();
}

module.exports.passwordValidation = passwordValidation = (req, res, next) => {

    const password = req.body.password;
    if (!password) {
        return res.status(422).json({message: "password field is required"})
    } else {
        if (password.length < 6){
            return res.status(422).json({message: "password must be at least 6 symbols length"})
        }
    }

    next();
}