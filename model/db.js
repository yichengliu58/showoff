var dbClient = require("mongodb").MongoClient;
var dbUrl = "mongodb://localhost:27017";

var db = null;

/**
 * used to connect to the db, called at startup
 */
exports.connect = function() {
    dbClient.connect(dbUrl, {useNewUrlParser: true}, function (err, res) {
        if (err) {
            throw err;
        }

        db = res.db('showoff');
    });
};

/**
 * insert a data record into db
 * @param collection name (events or stories or users)
 * @param operation json string
 * @param callback for caller to call
 */
exports.insert = function(coll, json, callback) {
    db.collection(coll).insertOne(json, callback);
};

/**
 * search one record in the collection randomly
 * @param collection name
 * @param callback for caller to call
 */
exports.randomSearchOne = function(coll, callback) {
    db.collection(coll).aggregate([{$sample: {size: 1}}]).toArray(callback);
};

/**
 * do search using operation json by caller
 * @param collection name
 * @param operation json string
 * @param callback for caller to call
 */
exports.search = function(coll, json, callback) {
    db.collection(coll).find(json).toArray(callback);
};