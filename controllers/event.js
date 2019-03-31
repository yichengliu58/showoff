// event management
jsonParser = require('../utils/jsonParser');
respBuilder = require('../utils/respStatusCreator');

var io;
var socket;
var stories = [];
var events = [];

// test code
var idCount = 1;

function toRad(d) {  return d * Math.PI / 180; }

function getDisance(lat1, lng1, lat2, lng2) {
    if(lat1 === null || lng1 === null || lat2 === null || lng2 === null ||
        lat1 < 0 || lng1 < 0 || lat2 < 0 || lng2 < 0) {
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
            events.push(JSON.stringify(event));
        }
        story.sid = idCount++;
        stories.push(JSON.stringify(story));
        io.emit('put story', JSON.stringify(respBuilder.create("STATUS_OK")));
    }
};

exports.getStoryByUser = function(msg) {
};

exports.getNextStory = function (msg) {
    // these are just for test
    if(stories.length == 0) {
        stories.push('{"sid": 0, "uid": 1, "text": "default test", "imgs": null,' +
            '"datetime": "2019-03-25T17:36:54.809Z", "location": {' +
            '"lo": 1, "la": 2 }, "ename": "xxx", "newevent": true}');
    }

    var line = parseInt(msg);
    if(line == NaN || line == -1) {
        line = 0;
    } else if(line == stories.length - 1) {
        io.emit('get next story', JSON.stringify(respBuilder.create("STATUS_NO_STORY")));
        return;
    } else {
        line += 1;
    }

    io.emit('get next story', stories[line]);
    // end of test code
};

exports.getPreviousStory = function(msg) {
    var line = parseInt(msg);
    if(line == NaN || line <= 0 || line >= stories.length) {
        io.emit('get previous story', JSON.stringify(respBuilder.create("STATUS_NO_STORY")));
        return;
    }
    line -= 1;
    io.emit('get previous story', stories[line]);
};

exports.getAllEvents = function(msg) {
    io.emit('get all events', JSON.stringify(events));
};

exports.searchEvents = function(msg) {
    var cor = JSON.parse(msg);
    // database op needed
    var index = [];
    var dindex = [];
    for(i = 0; i < events.length; i++) {
        var parsed_event = JSON.parse(events[i]);
        var la = parsed_event.location.la;
        var lo = parsed_event.location.lo;
        var ename = parsed_event.name;
        var datetime = parsed_event.datetime;
        var dis = getDisance(la, lo, cor.location.la, cor.location.lo);

        if(ename === cor.name) {
            index.push(i);
            dindex.push(dis);
            continue;
        }

        if(Math.abs(Date.parse(datetime) - Date.parse(cor.datetime)) < 24*60*60*1000) {
            index.push(i);
            dindex.push(dis);
            continue;
        }

        if(dis <= 1000) {
            index.push(i);
            dindex.push(dis);
            continue;
        }
    }

    jsonIndex = [];
    for(i = 0; i < index.length; i++) {
        var oe = JSON.parse(events[index[i]]);
        var e = {
            "name": oe.name,
            "datetime": oe.datetime,
            "distance": dindex[i]
        };
        jsonIndex.push(e);
    }
    io.emit('search events', JSON.stringify(jsonIndex));
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
