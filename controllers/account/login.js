// login and logout logic
// including font end pages logic

var resp_status_creator = require('../../utils/respStatusCreator.js');

// login interface handler function
exports.login = function (req, res) {
    req.session.user = req.body.username;
    return res.json(resp_status_creator.create("STATUS_OK"));
};

exports.loginPage = function (req, res) {
    return res.render('login');
};

exports.logout = function (req, res) {
    req.session.destroy();
    return res.json(resp_status_creator.create("STATUS_OK"));
};

