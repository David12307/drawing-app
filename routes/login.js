const express = require('express');
const router = express.Router();
const User = require('../models/user');
const settings = require('./variables');

router.get('/', (req, res) => {
    if (settings.isValid === true) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

router.post('/', (req, res) => {
    User.find({username: req.body.username, password: req.body.password})
     .then(result => {
        if (result.length === 1) {
            settings.currUser = req.body.username;
            settings.isValid = true;
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
     })
});

module.exports = router;