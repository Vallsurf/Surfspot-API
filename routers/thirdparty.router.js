const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router();
const request = require('request');
const fetch = require('node-fetch')
var rp = require('request-promise-native');

// const { Spots } = require('../models/spots');

router.use(jsonParser);

router.route('/')
    .get((req, res) => {
        // let forecast
        // let wind
        // let tide
        // let swell
        // let urls = [
        //     `http://api.spitcast.com/api/county/wind/orange-county/`,
        //     `http://api.spitcast.com/api/county/swell/orange-county/`,
        //     `http://api.spitcast.com/api/county/tide/orange-county`]
        
        //     var options = {
        //         uri: 'http://api.spitcast.com/api/county/wind/orange-county/',
        //         json: true // Automatically parses the JSON string in the response
        //     };

        //     var options2 = {
        //         uri: 'http://api.spitcast.com/api/county/wind/los-angeles/',
        //         json: true // Automatically parses the JSON string in the response
        //     };
             
        //     Promise.all([
        //         rp(options),
        //         rp(options2)])
        //         .then(function(first, second) {first.pipe(process.stdout)})
        //         .catch(function (err) {
        //             // API call failed...
        //         });

        let urls = [
            `http://api.spitcast.com/api/county/wind/orange-county/`,
            `http://api.spitcast.com/api/county/swell/orange-county/`,
            `http://api.spitcast.com/api/county/tide/orange-county`]
        //get spot forecast first and handle if doesn't exist
        let forecast; 
        fetch(`http://api.spitcast.com/api/spot/forecast/205/`)
        .then(res => {
            if(!res.ok){return forecast=`nogood`}
            return res.json()})
        .then(forecast => {res.status(200).json(forecast)})
        
        .catch(err => {return console.log(`err: ${err}`)})
      //get County Data
        // .then(Promise.all(urls.map(url => fetch(url))).then(([res1,res2,res3]) => Promise.all([res1.json(), res2.json(), res3.json()]))
        // .then(([ wind, swell, tide]) => {
                    
    });

router.route('/:county/:id')
    .get((req, res) => {
    request({
        uri: 'http://api.spitcast.com/api/county/spots/orange-county/',
      }).pipe(res);
    });

module.exports = { router };

