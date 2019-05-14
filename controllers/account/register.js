var db = require('../../model/db');
var resp_status_creator = require('../../utils/respStatusCreator.js');

/**
 * register logic, use db to insert new record
 * @param req request object in nodejs
 * @param res response object in nodejs
 * @return result of register
 */
exports.register = function (req, res) {
    db.search("users", {username: req.body.username}, function (err, r) {
        if(err || r.length !== 0) {
            return res.json(resp_status_creator.create("STATUS_USER_EXIST"));
        } else {
            db.insert("users", {username: req.body.username, password: req.body.password},
                function (err, r) {
                    if(err) {
                        return res.json(resp_status_creator.create("STATUS_DB_ERR"));
                    } else {
                        return res.json(resp_status_creator.create("STATUS_OK"));
                    }
            });
        }
    });
};

/**
 * register page
 * @param req request object in nodejs
 * @param res response object in nodejs
 * @return result of rendering
 */
exports.registerPage = function (req, res) {
    return res.render('register');
};