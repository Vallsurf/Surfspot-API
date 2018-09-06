
const express = require('express');
const passport = require('passport');
require('../auth/strategies')(passport);

const jwttoken = passport.authenticate('jwt', { session: false });

// const disableWithToken = require('../disableWithToken').disableWithToken;
const errorsParser = require('../errorsParser.js');
const { User } = require('../models/users');
const { Spots } = require('../models/spots');

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
                savedspots: []
            }))
            .then(user => res.status(201).json(user))

            .catch((err) => {
                if (err.reason === 'ValidationError') 
                { return res.status(err.code).json(err); } 
                res.status(400).json(errorsParser.generateErrorResponse(err));
            });
    })  
    
    //debug no auth GET 
    // .get((req, res) => {
    //     User.find({ username: 'greatest'})
    //     .populate(`savedspots`).exec()
    //     .then(users => res.status(200).json(users))
    // });

    .get(jwttoken, (req, res) => {
        User.find({ _id: req.user._id})
        .populate(`savedspots`).exec()
        .then(users => res.status(200).json(users))      
    });

router.route('/removespot/:id')
    .patch(jwttoken, (req,res) => {  
        Spots
       .findOne({spot_id : req.params.id}).select('_id')
       .then(spotobjid => {
          User
          .findOneAndUpdate(
              { _id: req.user._id}, {$pull: {savedspots : spotobjid._id}}, {new: true}
            ).populate(`savedspots`).exec()
            .then(updatedUser => res.status(200).json(updatedUser))  
          .catch(err => res.status(500).json({ message: 'Something went wrong' }));
        })
    }); 

router.route('/addspot/:id')
    .patch(jwttoken, (req,res) => {  
        Spots
       .findOne({spot_id : req.params.id}).select('_id')
       .then(spotobjid => {
          User
          .findOneAndUpdate(
              { _id: req.user._id}, {$push: {savedspots : spotobjid._id}}, {new: true}
            ).populate(`savedspots`).exec()
            .then(updatedUser => {
                res.status(200).json(updatedUser)
               })
          .catch(err => res.status(500).json({ message: 'Something went wrong' }));
        })
      
    }); 



module.exports = { router };
