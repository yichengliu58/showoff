// register logic
var db = require('../../model/db');
var resp_status_creator = require('../../utils/respStatusCreator.js');

// login interface handler function
exports.register = function (req, res) {
    db.insert("users", {username: req.body.username, password: req.body.password},
        function (err, r) {
            if(err) {
                return res.json(resp_status_creator.create("STATUS_DB_ERR"));
            } else {
                return res.json(resp_status_creator.create("STATUS_OK"));
            }
        });
};

exports.registerPage = function (req, res) {
    return res.render('register');
};