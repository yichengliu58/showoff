// event management
jsonParser = require('../utils/jsonParser');
respBuilder = require('../utils/respStatusCreator');

var io;
var socket;
var stories = [];
var events = [];

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
            events.push(story.ename + "\n");
        }
        stories.push(msg + "\n");
        io.emit('put story', JSON.stringify(respBuilder.create("STATUS_OK")));
    }
};

exports.getStoryByUser = function(msg) {
};

exports.getStoryRandomly = function (msg) {
    // these are just for test
    if(stories.length == 0) {
        stories.push('{"uid": 1, "text": "default test", "imgs": {' +
            '"i1": "", "i2": "", "i3": "" },' +
            '"datetime": "2019-03-25T17:36:54.809Z", "location": {' +
            '"lo": 1, "la": 2 }, "ename": "xxx", "newevent": true}');
    }

    line = Math.floor(Math.random()*stories.length);
    io.emit('get story randomly', stories[line]);

    // end of test code
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
