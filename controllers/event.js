// event management
jsonParser = require('../utils/jsonParser');
respBuilder = require('../utils/respStatusCreator');
db = require("../model/db");

var io;
var socket;

// will not be used, not concurrently safe
var idCount = 1;

function toRad(d) {  return d * Math.PI / 180; }

function getDisance(lat1, lng1, lat2, lng2) {
    if(lat1 === "" || lng1 === "" || lat2 === "" || lng2 === "") {
        return 0;
    }

    var radLat1 = toRad(lat1);
    var radLat2 = toRad(lat2);
    var deltaLat = radLat1 - radLat2;
    var deltaLng = toRad(lng1) - toRad(lng2);

    var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));

    return dis * 6378137;
}

exports.setIO = function(IO) {
    io = IO;
};

exports.setSocket = function(sock) {
    socket = sock;
};

exports.putStory = function(msg) {
    // check if there is a new event first
    var story = jsonParser.parseJSON(msg);
    if(story == null) {
        io.emit('put story', JSON.stringify(respBuilder.create("STATUS_WRONG_JSON")));
    } else {
        // this should be db operation finally
        if(story.newevent == true) {
            var event = {
                "name": story.ename,
                "datetime": story.datetime,
                "location": {
                    "la": story.location.la,
                    "lo": story.location.lo
                }
            };
            db.insert("events", event, null);
        }
        db.insert("stories", story, function (err, res) {
            if(err) {
                io.emit('put story', JSON.stringify(respBuilder.create("STATUS_DB_ERR")));
            } else {
                io.emit('put story', JSON.stringify(respBuilder.create("STATUS_OK")));
            }
        });
    }
};

exports.getStoryByUser = function(username) {
    db.search("stories", {uid: username}, function (err, res) {
        if(err || res.length == 0) {
            io.emit('get story by user', JSON.stringify(respBuilder.create("STATUS_DB_ERR")));
        } else {
            io.emit('get story by user', res);
        }
    });
};

exports.getNextStory = function (msg) {
    // will produce random one
    db.randomSearchOne("stories", function (err, res) {
        if(err) {
            io.emit('get next story', JSON.stringify(""));
        } else {
            io.emit('get next story', res);
        }
    });
};

exports.getPreviousStory = function(msg) {
    // will produce random one
    db.randomSearchOne("stories", function (err, res) {
        if(err) {
            io.emit('get next story', JSON.stringify(""));
        } else {
            io.emit('get next story', res);
        }
    });
};

exports.getAllEvents = function(msg) {
    db.search("events", null, function (err, res) {
        if(err || res.length == 0) {
            io.emit('get all events', JSON.stringify(""));
        } else {
            io.emit('get all events', res);
        }
    });
};

exports.getAllStories = function(msg) {
    db.search("stories", null, function (err, res) {
        if(err || res.length == 0) {
            io.emit('get all stories', JSON.stringify(""));
        } else {
            io.emit('get all stories', res);
        }
    });
};

exports.searchEvents = function(msg) {
    var arg = JSON.parse(msg);

    if(arg.name != null && arg.name.length != 0) {
        db.search("events", {name: {$regex:arg.name}}, function (err, res) {
            if(err) {
                io.emit('search event', JSON.stringify(""));
            } else {
                io.emit('search event', res);
            }
        });
    } else if(arg.datetime != null) {
        db.search("events", {datetime: {$regex:arg.datetime}}, function (err, res) {
            if(err) {
                io.emit('search event', JSON.stringify(""));
            } else {
                io.emit('search event', res);
            }
        });
    } else {
        var cond = {$and: [{$where: '(this.location.la - '+arg.location.la+' <= 1000)'},
                            {$where: '(this.location.lo - '+arg.location.lo+' <= 1000)'}]};
        db.search("events", cond, function (err, res) {
            if(err) {
                io.emit('search event', JSON.stringify(""));
            } else {
                io.emit('search event', res);
            }
        });
    }
};

exports.chat = function(msg) {
    data = jsonParser.parseJSON(msg);
    if(data != null) {
        io.emit('chat', data.uid + " : " + data.msg);
    }
};

// test codes for socket.io
exports.chatPage = function (req, res) {
    res.render('chat');
};
