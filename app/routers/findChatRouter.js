const express = require('express');
const db = require('./../services/db.js');

const findRouter = express.Router();

findRouter.route('/')
    .post((req, res, next) => {
        req.on('data', (data) => {
            console.log("POST data: " + data);
            const dataDecoded = JSON.parse(data);

            console.log("Connected to mongoDB for finding");
            const collection = db.get().collection("chats");
            let responseData;
            // Try to find room with free user2 place OR create new room
            collection.find({
                userLocation: dataDecoded.userLocation,
                user2: null,
                userLabel: dataDecoded.userLabel
            }).toArray((err, docs) => {
                if (docs[0] === undefined) {
                    console.log('not FOUND, creating new room');
                    collection.insertOne({
                            user1: dataDecoded.userName,
                            user2: null,
                            userLocation: dataDecoded.userLocation,
                            userLabel: dataDecoded.userLabel
                        }, (err, result) => {
                            responseData = JSON.stringify({
                                status: 'waiting',
                                room: result.ops[0]._id
                            });
                            res.writeHead(200);
                            res.end(responseData);
                        }
                    );
                } else {
                    console.log('FOUND partner, adding to his room');
                    collection.updateOne(
                        {
                            _id: docs[0]._id
                        },
                        {
                            $set: {"user2": dataDecoded.userName}
                        }, function (err, result) {
                            responseData = JSON.stringify({
                                status: 'connected',
                                room: docs[0]._id
                            });
                            res.writeHead(200);
                            res.end(responseData);
                        }
                    );

                }
            });

        });
    });

module.exports = findRouter;