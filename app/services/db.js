/**
 * Helper for reusing mongo connection
 */

var MongoClient = require('mongodb').MongoClient;

var state = {
    db: null
};

var dbUtils = {};

dbUtils.connect = function(url, done) {
    if (state.db) return done();

    MongoClient.connect(url, function(err, db) {
        if (err) return done(err);
        state.db = db;
        done();
    });
};

dbUtils.get = function() {
    return state.db;
};

dbUtils.close = function(done) {
    if (state.db) {
        state.db.close(function(err, result) {
            state.db = null;
            state.mode = null;
            done(err);
        });
    }
};

module.exports = dbUtils;