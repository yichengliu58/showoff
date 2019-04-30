// login and logout logic
// including font end pages logic

var resp_status_creator = require('../../utils/respStatusCreator.js');
var db = require('../../model/db');

// login interface handler function
exports.login = function (req, res) {
    db.search("users", {username: req.body.username, password: req.body.password},
        function (err, r) {
            if(err) {
                return res.json(resp_status_creator.create("STATUS_DB_ERR"));
            } else if (r.length == 0) {
                return res.json(resp_status_creator.create("STATUS_WRONG_PWD"));
            } else {
                req.session.user = req.body.username;
                return res.json(resp_status_creator.create("STATUS_OK"));
            }
        });
};

exports.loginPage = function (req, res) {
    return res.render('login');
};

exports.logout = function (req, res) {
    req.session.destroy();
    return res.json(resp_status_creator.create("STATUS_OK"));
};

