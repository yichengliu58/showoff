var resp_status_creator = require('../../utils/respStatusCreator.js');
var db = require('../../model/db');

/**
 * login logic, using db to search if the username and password matches
 * @param req request object in nodejs
 * @param res response object in nodejs
 * @return json string representing the result
 */
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

/**
 * login page
 * @param req request object in nodejs
 * @param res response object in nodejs
 * @return result of rendering
 */
exports.loginPage = function (req, res) {
    return res.render('login');
};

/**
 * logout page, used to destroy session object
 * @param req request object in nodejs
 * @param res response object in nodejs
 * @return result of the logout state
 */
exports.logout = function (req, res) {
    req.session.destroy();
    return res.json(resp_status_creator.create("STATUS_OK"));
};

