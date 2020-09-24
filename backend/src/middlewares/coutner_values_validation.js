module.exports = counterValueValidation = (req, res, next) => {

    const value = req.body.value;
    if (!value) {
        return  res.status(422).json({message: "value field is required"})
    }

    next();
};
