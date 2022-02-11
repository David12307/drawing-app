const express = require('express');
const router = express.Router();
const User = require('../models/user');
const settings = require('./variables');
var number = 0;

router.get('/', (req, res) => {
    if (settings.isValid === true) {
        res.redirect('/');
    } else {
        res.render('register');
    }
});

router.post('/', (req, res) => {
    var user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    function checkNumber(n) {
        if (n === 2) {
            user.save()
             .then(result => res.redirect('/login'))
             .catch(err => console.log(err));
            number = 0;
        } else {
            res.redirect('/register');
            number = 0;
        }
    }

    function checkUser() {
        User.find({username: req.body.username})
         .then(result => {
            if (result.length === 0) {
                number++;
            } else {
                console.log('Username already taken.');
                number += 3;
            }
         })
         .catch(err => console.log(err));

        User.find({email: req.body.email})
         .then(result => {
            if (result.length === 0) {
                number++;
                checkNumber(number);
            } else {
                console.log('Email already taken.');
                number += 3;
                checkNumber(number);
            }
         })
         .catch(err => console.log(err));
    }

    checkUser();
});

module.exports = router;