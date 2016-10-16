/**
 * Server file
 */

var server = {};
var express = require('express');
var app = express();
var http = require('http').Server(app);

// Redirect http to https
function requireHTTPS(req, res, next) {
    if (process.env.PORT !== undefined && !req.secure) {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}
app.use(requireHTTPS);

var findChatRouter = require('./app/routers/findChatRouter.js');
app.use('/findchat', findChatRouter);
app.use(express.static(__dirname + '/public'));

// Connect to DB and start listening
var db = require('./app/services/db.js');
var config = require('./app/server.conf.js');
var mongoURL = config.mongoUrl;

db.connect(mongoURL, function (err) {
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