
const express = require('express');
const passport = require('passport');
// require('../auth/strategies')(passport);

// const jwttoken = passport.authenticate('jwt', { session: false });

// const disableWithToken = require('../disableWithToken').disableWithToken;
const errorsParser = require('../errorsParser.js');
const { User } = require('../models/users');

const router = express.Router();


// create new user
router.route('/')
    .post((req, res) => {
        const {
            username, password
        } = req.body;

        return User.find({ username })
            .count()
            .then((count) => {
                if (count > 0) {
                    // There is an existing user with the same username
                    return Promise.reject({
                        code: 422,
                        reason: 'ValidationError',
                        message: 'Username already taken',
                        location: 'username',
                    });
                }
                return User.hashPassword(password);
            })
            .then(hash => User.create({
                username: req.body.username,
                password: hash,
                savedspots: `5b70bd9dac4e57f660120f48`
            }))
            .then(user => res.status(201).json(user))

            .catch((err) => {
                if (err.reason === 'ValidationError') 
                { return res.status(err.code).json(err); } 
                res.status(400).json(errorsParser.generateErrorResponse(err));
            });
    })


    .get((req, res) => {
        const test_id = `5b7e15c603571617f3693993`; 
        User.find({ username: 'malibu'})
        .populate(`savedspots`).exec()
        .then(users => res.status(200).json(users))

        
    });


module.exports = { router };
