// event management
jsonParser = require('../utils/jsonParser');
respBuilder = require('../utils/respStatusCreator');

var io;
var socket;
var stories = [];
var events = [];

// test code
var idCount = 1;

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
            events.push(story.ename);
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
        stories.push('{"sid": 0, "uid": 1, "text": "default test", "imgs": {' +
            '"i1": "", "i2": "", "i3": "" },' +
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
    if(line == NaN || line < 0 || line >= stories.length) {
        io.emit('get previous story', JSON.stringify(respBuilder.create("STATUS_NO_STORY")));
        return;
    }

    io.emit('get previous story', stories[line]);
};

exports.getAllEvents = function(msg) {
    io.emit('get all events', JSON.stringify(events));
};

exports.getEventsById = function(msg) {

};

exports.getEventsByLocation = function(msg) {

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
