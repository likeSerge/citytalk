var socketHandler = {};

var db = require('./db.js');
var mongo = require('mongodb'); //used for creating mongo object id
var io = require('../../server').io;

// NOTE: socket.rooms and socket.adapter.rooms

socketHandler.run = function () {
    var activeRooms = [];
    io.on('connection', function (socket) {

        socket.on('join room', function (room) {
            console.log('join room,socket_id=',socket.id);
            socket.join(room);
            activeRooms[socket.id] = room;

            if (socket.adapter.rooms[room].length === 2) {
                io.to(room).emit('start', '');
            };
        });

        socket.on('chat message', function (msg) {
            msg = {
                user: msg.user,
                text: msg.text.replace(/(<([^>]+)>)/ig,"")  //strip tags from user input
            };
            console.log('socket rooms:', socket.rooms);
            for (var room in socket.rooms) {
                var userRoom;
                if (room.indexOf('userRoom_') !== -1) {
                    userRoom = room;
                    break;
                }
            }
            socket.broadcast.to(userRoom).emit('chat message', msg);
        });

        socket.on('disconnect', function () {
            console.log('Got disconnect!', activeRooms);
            var room = activeRooms[socket.id];
            if (!room) {
                return;
            }
            var msg = {
                user: '<i style="color:indianred">SYSTEM</i>',
                text: '<span>Partner disconnected.. <a href="/#/find">Find new</a></span>'
            };
            socket.broadcast.to(room).emit('chat message', msg);
            var chatId = room.slice('userRoom_'.length);

            console.log("Connected to mongoDB for delete");
            var collection = db.get().collection("chats");
            var mongoObjectId = new mongo.ObjectID(chatId);
            collection.deleteOne({
                '_id': mongoObjectId
            }, function (err, result) {
                //pass
            });

        });
    });
};

module.exports = socketHandler;