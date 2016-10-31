/**
 * Server file
 */

const server = {};
const express = require('express');
const app = express();
const http = require('http').Server(app);

// Redirect http to https
app.get('*', (req, res, next) => {
    if (process.env.PORT !== undefined && req.headers['x-forwarded-proto'] !== 'https')
        res.redirect('https://' + req.get('host') + req.url);
    else
        next();
    /* Continue to other routes if we're not redirecting */
});

const findChatRouter = require('./app/routers/findChatRouter.js');
app.use('/findchat', findChatRouter);
app.use(express.static(__dirname + '/public'));

// Connect to DB and start listening
const db = require('./app/services/db.js');
const config = require('./app/server.conf.js');
const mongoURL = config.mongoUrl;

db.connect(mongoURL, (err) => {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1);
    } else {
        // Start the application after the database connection is ready
        http.listen(process.env.PORT || 3000);
        console.log('Server started, listening at port:', process.env.PORT || 3000);
    }
});


//TODO: check code below- passing var to required module with module.exports ??
// Socket logic
server.io = require('socket.io')(http);
module.exports = server;

const socketHandler = require('./app/services/socketHandler');
socketHandler.run();