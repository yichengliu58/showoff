/**
 * checking session info
 * @param req request object in nodejs
 * @param res response object in nodejs
 * @param next
 */
exports.sessionCheck = function (req, res, next) {
    if(req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};