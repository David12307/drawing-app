const express = require('express');
const app = express();
const server = require('http').createServer(app);
const mongoose = require('mongoose');
const io = require('socket.io')(server, { cors: {origin: "*"}});
const settings = require('./routes/variables.js');
const rooms = require('./rooms.json');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

// Connect database
var dbURI = "mongodb+srv://davidd:okiokioki123@cluster0.psmuv.mongodb.net/drawing?retryWrites=true&w=majority"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
 .then(result => {
    server.listen(3000, () => {
        console.log('Server running...');
    });
 })
 .catch(err => console.log(err));

// Routes

var homeRouter = require('./routes/home.js');
app.use('/', homeRouter);

var loginRouter = require('./routes/login.js');
app.use('/login', loginRouter);

var registerRouter = require('./routes/register.js');
app.use('/register', registerRouter);

io.on('connection', (socket) => {
    console.log('User connected with ID: ' + socket.id);

    socket.join(settings.currRoom);

    // When the user connect you emit an event to render the page
    socket.emit('render');

    // When the user connects to a room it gets all the users from the current room and render them
    for (i = 0; i < rooms.length; i++) {
        if (rooms[i].id === settings.currRoom) {
            io.in(settings.currRoom).emit('update-users', rooms[i].users);
        }
    }
    
    socket.on('draw-square', (id, color) => {
        io.in(settings.currRoom).emit('draw', id, color);
    })

    // When a user disconnects it removes the current user from the room that it was in
    socket.on('disconnect', () => {
        for (i = 0; i < rooms.length; i++) {
            if (rooms[i].id === settings.currRoom) {
                var room = i;
                for (i = 0; i < rooms[room].users.length; i++) {
                    if (rooms[room].users[i] === settings.currUser) {
                        rooms[room].users.splice(i, 1);
                        io.in(settings.currRoom).emit('update-users', rooms[room].users);
                        console.log(rooms[room].users.splice(i, 1));
                        settings.currRoom = '';
                    }
                }
            }
        }
    });
});