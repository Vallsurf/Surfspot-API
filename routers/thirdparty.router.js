const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router();
const fetch = require('node-fetch')
var rp = require('request-promise-native');

// const { Spots } = require('../models/spots');

router.use(jsonParser);

router.route('/:spot')
    .get((req, res) => {
        //get spot forecast first and handle if doesn't exist
        let forecast; 
        fetch(`http://api.spitcast.com/api/spot/forecast/${req.params.spot}/`)
        .then(res => {
            if(!res.ok){return forecast=`nogood`}
            return res.json()})
        .then(forecast => {res.status(200).json(forecast)})

        .catch(err => {return console.log(`err: ${err}`)})      
        
        

    });

router.route('/spotdetails/:county/:spot')
    .get((req, res) => {

        let urls = [
            `http://api.spitcast.com/api/county/wind/${req.params.county}/`,
            `http://api.spitcast.com/api/county/swell/${req.params.county}/`,
            `http://api.spitcast.com/api/county/tide/${req.params.county}/`]
        //get spot forecast first and handle if doesn't exist
        let forecast; 
        fetch(`http://api.spitcast.com/api/spot/forecast/${req.params.spot}/`)
        .then(res => {
            const contentType = res.headers.get("content-type"); 
            if(contentType && contentType.indexOf("application/json") !== -1){
            return res.json()}
            else{
                return forecast = [{key1 : 'test'}, {key2: 'test'}]
            }
        })
            
        .then(res => {forecast = res})
        .catch(err => {return console.log(`err: ${err}`)})
        .then(Promise.all(urls.map(url => fetch(url))).then(([res1,res2,res3]) => Promise.all([res1.json(), res2.json(), res3.json()])) .catch(err => console.log(err))
        .then(([ wind, swell, tide]) => {
            if(forecast){
            let response = {wind: [...wind],
                            swell: [...swell],
                            tide: [...tide],
                            forecast: [...forecast]
            } 
            
            res.status(200).json(response)
        }
            else{
                forecast = [{key1 : 'test'}, {key2: 'test'}]
            let response = {wind: [...wind],
                            swell: [...swell],
                            tide: [...tide],
                            forecast: [...forecast]
                            } 
            
            res.status(200).json(response)
        }
            }).catch(err => console.log(err))
        )
      .catch(err => console.log(err));
    });

module.exports = { router };

