// event management
jsonParser = require('../utils/jsonParser');
respBuilder = require('../utils/respStatusCreator');

var io;
var socket;
var lines = [];

exports.setIO = function(IO) {
    io = IO;
};

exports.setSocket = function(sock) {
    socket = sock;
};

exports.putStory = function(msg) {
    lines.push(msg + '\n');
    io.emit('put story', JSON.stringify(respBuilder.create("STATUS_OK")));
};

exports.putEvent = function(msg) {
    io.emit('put event', JSON.stringify(respBuilder.create("STATUS_OK")));
};

exports.getStoryById = function(msg) {

};

exports.getStoryRandomly = function (msg) {
    // these are just for test
    if(lines.length == 0) {
        lines.push('{"uid": 1, "text": "default test", "imgs": {' +
            '"i1": "", "i2": "", "i3": "" },' +
            '"datetime": "2019-03-25T17:36:54.809Z", "location": {' +
            '"lo": 1, "la": 2 }, "ename": "xxx"');
    } else if(lines.length > 1) {
        lines.shift();
    }

    line = Math.floor(Math.random()*lines.length);
    io.emit('get story randomly', lines[line]);

    // end of test code
};

exports.getEvents = function(msg) {

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
