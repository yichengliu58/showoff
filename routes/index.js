// main page routers

var express = require('express');
var router = express.Router();

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

module.exports = router;
