
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router();
const request = require('request');
// const { Spots } = require('../models/spots');

router.use(jsonParser);

router.route('/')
    .get((req, res) => {
        request({
            uri: 'https://jsonplaceholder.typicode.com/todos/1',
          }).pipe(res);
        });

module.exports = { router };

