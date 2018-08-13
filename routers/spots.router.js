
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router();
const { Spots } = require('../models/spots');

router.use(jsonParser);



router.route('/')
    .get((req, res) => {
        // Spots.find()
        Spots.aggregate([{$group: {_id: "$county_name", spots: {$push: "$$ROOT"}}}])
            .then(spots => res.status(200).json(spots))
            .catch(err => res.status(500).json({ message: `${err}` }));
    });

module.exports = { router };