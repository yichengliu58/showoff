// main page routers

var express = require('express');
var router = express.Router();

var event = require('../controllers/event');
var session = require('../middleware/session');

router.use(session.sessionCheck);

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/index', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/homepage', function(req, res, next) {
    res.render('homepage', { title: 'Express' });
});

// event operations
router.get('/chat', event.chatPage);

/**
 * set socket events
 * @param io socket object
 * @return io socket object
 */
router.io = function(io) {
    io.on('connection', function (socket) {
        event.setIO(io);
        event.setSocket(socket);

        // function definition
        socket.on('put story', event.putStory);
        socket.on('get story by user', event.getStoryByUser);
        socket.on('get next story', event.getNextStory);
        socket.on('get previous story', event.getPreviousStory);
        socket.on('get all events', event.getAllEvents);
        socket.on('get all stories', event.getAllStories);
        socket.on('search event', event.searchEvents);
        socket.on('search stories', event.searchStories);
        socket.on('chat', event.chat);
    });
    return io;
};

module.exports = router;
