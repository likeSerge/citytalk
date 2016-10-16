/**
 * Server file
 */

var server = {};
var express = require('express');
var app = express();
var http = require('http').Server(app);

var findChatRouter = require('./app/routers/findChatRouter.js');
app.use('/findchat', findChatRouter);
app.use(express.static(__dirname + '/public'));

// Connect to DB and start listening
var db = require('./app/services/db.js');
var config = require('./app/config/server.conf.js');
var mongoURL = config.mongoUrl;

db.connect(mongoURL, function(err) {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1);
    } else {
        // Start the application after the database connection is ready
        http.listen(process.env.PORT || 3000);
    }
});


//TODO: check code below- passing var to required module with module.exports ??
// Socket logic
server.io = require('socket.io')(http);
module.exports = server;

var socketHandler = require('./app/services/socketHandler');
socketHandler.run();