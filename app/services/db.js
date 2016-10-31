/**
 * Helper for reusing mongo connection
 */

const MongoClient = require('mongodb').MongoClient;

let state = {
    db: null
};

var dbUtils = {};

dbUtils.connect = (url, done) => {
    if (state.db) return done();

    MongoClient.connect(url, (err, db) => {
        if (err) return done(err);
        state.db = db;
        done();
    });
};

dbUtils.get = () => {
    return state.db;
};

dbUtils.close = (done) => {
    if (state.db) {
        state.db.close((err, result) => {
            state.db = null;
            state.mode = null;
            done(err);
        });
    }
};

module.exports = dbUtils;