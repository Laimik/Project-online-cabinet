const express = require('express');
const authenticateJWT = require("../middlewares/authenticateJWT");
const router = express.Router();
require('dotenv').config();
const fetch = require('node-fetch');

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const addressValidation = require("../middlewares/addresses_validation");
const {getAddressById, getAddresses, createAddress, updateAddress, deleteAddresses} = require("../services/addressService");

router.get('/', authenticateJWT, async (req, res) => {
        const user = req.user;
        try {
            res.status(200).json(await getAddresses(user.id));
        } catch (e){
            console.error(e);
            res.sendStatus(500);
        }
    }
);

router.get('/search', authenticateJWT, async (req, res) => {
    const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
    const criteria = req.query.criteria;
    const detalization = req.query.detalization;
    const regionFiasId = req.query.region_fias_id;
    const areaFiasId = req.query.area_fias_id
    const cityFiasId = req.query.city_fias_id;
    const settlementFiasId = req.query.settlement_fias_id;
    const streetFiasId = req.query.street_fias_id;

    console.log(req.query);
    const bounds = {}
    switch (detalization) {
        case 'region': {
            bounds.from_bound = { "value": "region" };
            bounds.to_bound = { "value": "region" };
            bounds.restrict_value = true;
            break;
        }
        case 'area': {
            bounds.from_bound = { "value": "area" };
            bounds.to_bound = { "value": "area" };
            bounds.locations = [
                {
                    "region_fias_id": regionFiasId
                }
            ];
            bounds.restrict_value = true;
            break;
        }
        case 'city': {
            if (regionFiasId) {
                bounds.locations = [
                    {
                        "region_fias_id": regionFiasId
                    }
                ];
            }
            if (areaFiasId) {
                bounds.locations = [
                    {
                        "area_fias_id": areaFiasId
                    }
                ];
            }
            bounds.from_bound = { "value": "city" };
            bounds.to_bound = { "value": "city" };
            bounds.restrict_value = true;
            break;
        }
        case 'settlement':{
            if (regionFiasId) {
                bounds.locations = [
                    {
                        "region_fias_id": regionFiasId
                    }
                ];
            }
            if (areaFiasId) {
                bounds.locations = [
                    {
                        "area_fias_id": areaFiasId
                    }
                ];
            }
            if (cityFiasId) {
                bounds.locations = [
                    {
                        "city_fias_id": cityFiasId
                    }
                ];
            }
            {
                bounds.from_bound = { "value": "settlement" };
                bounds.to_bound = { "value": "settlement" };
                bounds.restrict_value = true;
                break;
            }
        }
        case 'street':{
            if (cityFiasId) {
                bounds.locations = [
                    {
                        "city_fias_id": cityFiasId
                    }
                ];
            }
            if (settlementFiasId) {
                bounds.locations = [
                    {
                        "settlement_fias_id": settlementFiasId
                    }
                ];
            }
            bounds.from_bound = { "value": "street" };
            bounds.to_bound = { "value": "street" };
            bounds.restrict_value = true;
            break;
        }
        case 'house': {
            if (streetFiasId) {
                bounds.locations = [
                    {
                        "street_fias_id": streetFiasId
                    }
                ];
            }
            if (settlementFiasId) {
                bounds.locations = [
                    {
                        "settlement_fias_id": settlementFiasId
                    }
                ];
            }
            {
                bounds.from_bound = { "value": "house" };
                bounds.restrict_value = true;
                break;
            }
        }
    }


    if (criteria) {
        const options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + process.env.DADATA_API_KEY
            },
            body: JSON.stringify({
                query: criteria,
                ...bounds
            })
        }

        const response = await fetch(url, options)
        res.status(200).json(await response.json());
    } else {
        res.status(200).json({"suggestions": []});
    }
});

router.get('/:id', authenticateJWT, async (req, res) => {
        const id = req.params.id;
        const user = req.user;
        try {
            const address = await getAddressById(user.id, id);
            if (address) {
                res.status(200).json(address);
            } else {
                res.sendStatus(404);
            }
        } catch (e){
            console.error(e);
            res.sendStatus(500);
        }
    }
);

router.post('/', [authenticateJWT, urlencodedParser, addressValidation], async (req, res) => {
        const user = req.user;
        const address = req.body.address;
        const apartments = req.body.apartments;
        const fias = req.body.fias_code;
        try {
            const createdAddress = await createAddress(user.id, address, apartments, fias);
            res.status(200).json(createdAddress);
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }
);

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
});

router.delete('/:id', authenticateJWT, async (req, res) => {
    const id = req.params.id
    const user = req.user;
    try {
        await deleteAddresses(id, user.id);
        res.sendStatus(200);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

module.exports = router;