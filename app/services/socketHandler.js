let socketHandler = {};

const db = require('./db.js');
const mongo = require('mongodb'); //used for creating mongo object id
const io = require('../../server').io;

// NOTE: socket.rooms and socket.adapter.rooms

socketHandler.run = () => {
    let activeRooms = [];
    io.on('connection', (socket) => {

        socket.on('join room', (room) => {
            console.log('join room,socket_id=', socket.id);
            socket.join(room);
            activeRooms[socket.id] = room;

            if (socket.adapter.rooms[room].length === 2) {
                io.to(room).emit('start', '');
            }
        });

        socket.on('chat message', (msg) => {
            msg = {
                user: msg.user,
                text: msg.text.replace(/(<([^>]+)>)/ig, "")  //strip tags from user input
            };
            console.log('socket rooms:', socket.rooms);
            let userRoom;
            for (let room in socket.rooms) {
                if (room.indexOf('userRoom_') !== -1) {
                    userRoom = room;
                    break;
                }
            }
            socket.broadcast.to(userRoom).emit('chat message', msg);
        });

        socket.on('disconnect', () => {
            console.log('Got disconnect!', activeRooms);
            const room = activeRooms[socket.id];
            if (!room) {
                return;
            }
            const msg = {
                user: '<i style="color:indianred">SYSTEM</i>',
                text: '<span>Partner disconnected.. <a href="/#/find">Find new</a></span>'
            };
            socket.broadcast.to(room).emit('chat message', msg);
            const chatId = room.slice('userRoom_'.length);

            console.log("Connected to mongoDB for delete");
            const collection = db.get().collection("chats");
            const mongoObjectId = new mongo.ObjectID(chatId);
            collection.deleteOne({
                '_id': mongoObjectId
            }, (err, result) => {
                //pass
            });

        });
    });
};

module.exports = socketHandler;