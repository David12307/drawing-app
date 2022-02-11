const express = require('express');
const settings = require('./variables');
const router = express.Router();
const rooms = require('../rooms.json');

router.get('/play/:id', (req, res) => {
    if (settings.isValid) {
        var validRooms = [];
        for (i = 0; i < rooms.length; i++) {
            if (settings.currUser === rooms[i].users[i]) {
                validRooms.push(rooms[i].id);
            }
        }

        if (req.params.id === validRooms[0] || req.params.id === validRooms[1]) {
            res.render('index', {title: req.params.id});
            settings.currRoom = req.params.id;
            console.log(validRooms);
        } else {
            res.redirect('/');
            console.log(validRooms);
        }
    } else {
        res.redirect('/login');
    }
});

router.get('/', (req, res) => {
    if (settings.isValid == true) {
        res.render('home');
    } else {
        res.redirect('/login');
    }
});

router.post('/', (req, res) => {
    if (settings.isValid === true) {
        vRooms = [];
        for (i = 0; i < rooms.length; i++) {
            if (rooms[i].users.length < 6) {
                vRooms.push(rooms[i].id);
            }
        }

        randomRoom = vRooms[Math.floor(Math.random() * vRooms.length)];

        for (i = 0; i < rooms.length; i++) {
            if (rooms[i].id === randomRoom) {
                rooms[i].users.push(settings.currUser);
                res.redirect('/play/' + randomRoom);
            }
        }

        vRooms = [];
    } else {
        res.redirect('/login');
    }
})


module.exports = router;