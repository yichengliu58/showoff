// event management
jsonParser = require('../utils/jsonParser');

var io;
var socket;

exports.setIO = function(IO) {
    io = IO;
};

exports.setSocket = function(sock) {
    socket = sock;
};

exports.putStory = function(msg) {

};

exports.putEvent = function(msg) {

};

exports.getStoryById = function(msg) {

};

exports.getStoryRandomly = function (msg) {

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
