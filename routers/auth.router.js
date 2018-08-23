
const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router();
const { User } = require('../models/users');


const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');

router.use(jsonParser);
require('../auth/strategies')(passport);


router.route('/')
    .post((req, res) => {
        const {
            username, password
        } = req.body;
        let user;
        User.findOne({username: username})
           .populate(`savedspots`).exec()
            .then((foundResult) => {
                if (!foundResult) {
                    return Promise.reject({
                        code: 401,
                        reason: 'LoginError',
                        message: 'Username or password is incorrect',
                    });
                }
                user = foundResult;
                return foundResult.comparePassword(password);
            })
    
            .then((foundUser) => {
                if (!foundUser) {
                    return Promise.reject({
                        code: 401,
                        reason: 'LoginError',
                        message: 'Username or password is incorrect',
                    });
                }
    
                const userId = user._id;
    
                const tokenPayload = { _id: userId, username: user.username, userspots: user.savedspots };
                const token = jwt.sign(tokenPayload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRY });
    
                return res.status(200).json({ token });

                // return res.status(200).json({"message" : "success!"})
            })
    
            .catch((report) => {
                if (report.reason === 'LoginError') {
                    return res.status(report.code).json(report);
                }
                return res.status(400).json(report)
                // return res.status(400).json(errorsParser.generateErrorResponse(report));
            });


    });

module.exports = { router };