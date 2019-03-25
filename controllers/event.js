// event management
jsonParser = require('../utils/jsonParser');
respBuilder = require('../utils/respStatusCreator');

// test code, may be deleted
fs = require('fs');
// end of test code

var io;
var socket;
var lines = null;

exports.setIO = function(IO) {
    io = IO;
};

exports.setSocket = function(sock) {
    socket = sock;
};

exports.putStory = function(msg) {
    fs.appendFile('story.txt', msg + '\n', function (err) {  });
    io.emit('put story', JSON.stringify(respBuilder.create("STATUS_OK")));
};

exports.putEvent = function(msg) {
    fs.appendFile('event.txt', msg + '\n', function (err) {  });
    io.emit('put event', JSON.stringify(respBuilder.create("STATUS_OK")));
};

exports.getStoryById = function(msg) {

};

exports.getStoryRandomly = function (msg) {
    if(lines == null) {
        fs.readFile('story.txt', function (err, data) {
            if(err) {
                lines = null;
            } else {
                lines = data.toString().split('\n');
            }
        });
    }

    line = Math.floor(Math.random()*lines.length);
    io.emit('get story randomly', lines[line]);
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
