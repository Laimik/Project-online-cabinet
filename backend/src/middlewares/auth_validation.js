module.exports.signInValidation = signInValidation = (req, res, next) => {
    const email = req.body.email;
    if (!email){
        return res.status(422).json({message: "email field is required"})
    }

    next();
};

module.exports.signUpValidation = signUpValidation = (req, res, next) => {
    const name = req.body.email;
    if (!name){
        return res.status(422).json({message: "name field is required"})
    }

    const email = req.body.email;
    if (!email){
        return res.status(422).json({message: "email field is required"})
    } else {
        let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (!re.test(String(email).toLowerCase())){
            return res.status(422).json({message: "invalid email"})
        }
    }

    const password = req.body.password;
    if (!password) {
        return res.status(422).json({message: "password field is required"})
    }

    const number = req.body.phone_number;
    if (!number) {
        return res.status(422).json({message: "phone_number field is required"})
    } else {
        let re = /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/;
        if (!re.test(String(number).toLowerCase())){
            return res.status(422).json({message: "invalid phone number"})
        }
    }

    next();
};