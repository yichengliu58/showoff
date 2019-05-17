// event management
jsonParser = require('../utils/jsonParser');
respBuilder = require('../utils/respStatusCreator');
db = require("../model/db");

var io;
var socket;

/**
 * set socket io object
 * @param IO
 */
exports.setIO = function(IO) {
    io = IO;
};

/**
 * set socekt io object
 * @param sock
 */
exports.setSocket = function(sock) {
    socket = sock;
};

/**
 * receive client story and put into database
 * @param msg soekt io message
 */
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

/**
 * search stories using a username
 * @param username
 */
exports.getStoryByUser = function(username) {
    db.search("stories", {uid: username}, function (err, res) {
        if(err || res.length == 0) {
            io.emit('get story by user', JSON.stringify(respBuilder.create("STATUS_DB_ERR")));
        } else {
            io.emit('get story by user', res);
        }
    });
};

/**
 * get next story in database
 * @param msg
 */
exports.getNextStory = function (msg) {
    // will produce random one
    db.randomSearchOne("stories", function (err, res) {
        if(err) {
            io.emit('get next story', JSON.stringify());
        } else {
            io.emit('get next story', res);
        }
    });
};

/**
 * get previous story in database
 * @param msg
 */
exports.getPreviousStory = function(msg) {
    // will produce random one
    db.randomSearchOne("stories", function (err, res) {
        if(err) {
            io.emit('get next story', JSON.stringify());
        } else {
            io.emit('get next story', res);
        }
    });
};

/**
 * get all events in database
 * @param msg
 */
exports.getAllEvents = function(msg) {
    db.search("events", null, function (err, res) {
        if(err || res.length == 0) {
            io.emit('get all events', JSON.stringify());
        } else {
            io.emit('get all events', res);
        }
    });
};

/**
 * get all stories in database
 * @param msg
 */
exports.getAllStories = function(msg) {
    db.search("stories", null, function (err, res) {
        if(err || res.length == 0) {
            io.emit('get all stories', JSON.stringify());
        } else {
            io.emit('get all stories', res);
        }
    });
};

/**
 * search stories using location, name and datatime
 * @param msg
 */
exports.searchStories = function(msg) {
    var arg = JSON.parse(msg);

    if(arg.location !== null && arg.location.lo != "" && arg.location.la != "") {
        var cond = {
            $and: [{$where: '(this.location.la - ' + arg.location.la + ' <= 100)'},
                {$where: '(this.location.lo - ' + arg.location.lo + ' <= 100)'}]
        };

        db.search("stories", cond, function (err, res) {
            if (err) {
                io.emit('search stories', JSON.stringify());
            } else {
                io.emit('search stories', res);
            }
        });
        return;
    }

    if(arg.ename != "" && arg.ename.length != 0) {
        db.search("stories", {ename: {$regex:arg.ename}}, function (err, res) {
            if(err) {
                io.emit('search stories', JSON.stringify());
            } else {
                io.emit('search stories', res);
            }
        });
        return;
    }

    if(arg.datetime != "") {
        db.search("stories", {datetime: {$regex:arg.datetime}}, function (err, res) {
            if(err) {
                io.emit('search stories', JSON.stringify());
            } else {
                io.emit('search stories', res);
            }
        });
        return;
    }

    io.emit('search stories', JSON.stringify());
};

/**
 * search events using location, name and datetime
 * @param msg
 */
exports.searchEvents = function(msg) {
    var arg = JSON.parse(msg);

    if(arg.name != null && arg.name.length != 0) {
        db.search("events", {name: {$regex:arg.name}}, function (err, res) {
            if(err) {
                io.emit('search event', JSON.stringify());
            } else {
                io.emit('search event', res);
            }
        });
    } else if(arg.datetime != null) {
        db.search("events", {datetime: {$regex:arg.datetime}}, function (err, res) {
            if(err) {
                io.emit('search event', JSON.stringify());
            } else {
                io.emit('search event', res);
            }
        });
    } else {
        var cond = {$and: [{$where: '(this.location.la - '+arg.location.la+' <= 100)'},
                            {$where: '(this.location.lo - '+arg.location.lo+' <= 100)'}]};
        db.search("events", cond, function (err, res) {
            if(err) {
                io.emit('search event', JSON.stringify());
            } else {
                io.emit('search event', res);
            }
        });
    }
};

/**
 * chat room logic
 * @param msg
 */
exports.chat = function(msg) {
    data = jsonParser.parseJSON(msg);
    if(data != null) {
        io.emit('chat', data.uid + " : " + data.msg);
    }
};

/**
 * chat room renderer
 * @param req
 * @param res
 */
exports.chatPage = function (req, res) {
    res.render('chat');
};
