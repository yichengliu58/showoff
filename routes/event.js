// routers for coping with events
// get/upload events

var express = require('express');
var router = express.Router();

var event = require('../controllers/event');

// event operations
router.get('/api/getEvents', event.getEvents);
router.post("/api/putEvent", event.putEvent);

module.exports = router;
