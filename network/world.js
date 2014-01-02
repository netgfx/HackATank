var io = require('socket.io');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = io.listen(server);

// chat //
var rooms = ['GreatPlains'];
var usernames = {};

server.listen(8081);

io.sockets.on('connection', function (socket) {
    socket.on('adduser', function (username) {
        socket.username = username;
        socket.room = 'GreatPlains';
        if (usernames[username] !== undefined && usernames[username] !== null){
            socket.emit('adduser', 'SERVER', 'Username exists', username);
        }
        usernames[username] = username;
        socket.join('GreatPlains');
        socket.emit('adduser', 'SERVER', 'You have connected to GreatPlains', username);
        socket.broadcast.to('GreatPlains').emit('updateworld', 'SERVER', username + ' has entered this world');
        socket.emit('updaterooms', rooms, 'GreatPlains');
    });

    socket.emit('news', {
        room: 'GreatPlains'
    });

    socket.on('worldupdate', function (data) {
        console.log(data);
        socket.broadcast.to(socket.room).emit('updateworld', socket.username, data);
    });

    socket.on('login', onLogin);

    socket.on("sendchat", function (message) {
        io.sockets["in"](socket.room).emit('updatechat', socket.username, message);
    });

    socket.on('private message', function (from, msg) {
        console.log('I received a private message by ', from, ' saying ', msg);
    });

    socket.on('disconnect', function () {
        io.sockets.emit('user disconnected');
    });

});

function onLogin(username) {

}