var dbClient = require("mongodb").MongoClient;
var dbUrl = "mongodb://localhost:27017";

var db = null;

exports.connect = function() {
    dbClient.connect(dbUrl, {useNewUrlParser: true}, function (err, res) {
        if (err) {
            throw err;
        }

        db = res.db('showoff');
    });
};

exports.insert = function(coll, json, callback) {
    db.collection(coll).insertOne(json, callback);
};

exports.randomSearchOne = function(coll, callback) {
    db.collection(coll).aggregate([{$sample: {size: 1}}]).toArray(callback);
};

exports.search = function(coll, json, callback) {
    db.collection(coll).find(json).toArray(callback);
};