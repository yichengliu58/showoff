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
router.get('/api/getEvents', event.getEvents);
router.post("/api/putEvent", event.putEvent);
router.get('/test', event.test);

router.io = function(io) {
    io.on('connection', function (socket) {
        console.log("a user connected");
        socket.on('chat message', function (msg) {
            console.log(msg);
        });
    });
    return io;
};

module.exports = router;
