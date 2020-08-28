module.exports = addressValidation = (req, res, next) => {
    const address = req.body.address;
    if (!address){
        return res.status(422).json({message: "address field is required"})
    }

    const apartments = req.body.apartments;
    if (!apartments) {
        return res.status(422).json({message: "apartments field is required"})
    }

    const fias = req.body.fias_code;
    if (!fias) {
        return res.status(422).json({message: "fias_code field is required"})
    }

    next();
};
