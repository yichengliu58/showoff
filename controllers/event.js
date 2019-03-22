// event management

// get all the events info
exports.getEvents = function (req, res) {
    return res.json({"OK": 1});
};

exports.putEvent = function (req, res) {
};

// test codes for socket.io
exports.test = function (req, res) {
    res.render('test');
};
