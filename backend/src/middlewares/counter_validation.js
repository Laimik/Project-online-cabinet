module.exports.counterPostValidation = counterPostValidation = (req, res, next) => {
    const name = req.body.name;
    if (!name){
        return res.status(422).json({message: "name field is required"})
    }

    const addressId = req.body.address_id;
    if (!addressId) {
        return res.status(422).json({message: "address_id field is required"})
    }

    const counterTypeId = req.body.counter_type_id;
    if (!counterTypeId) {
        return res.status(422).json({message: "counter_type_id field is required"})
    }

    next();
};

module.exports.counterPutValidation = counterPutValidation = (req, res, next) => {
    const name = req.body.name;
    if (!name){
        return res.status(422).json({message: "name field is required"})
    }

    next();
};
