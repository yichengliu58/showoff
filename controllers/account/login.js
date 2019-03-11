// login and logout logic
// including font end pages logic

var resp_status_creator = require('../../utils/respStatusCreator.js');

// login interface handler function
exports.login = function (req, res) {
    return res.json(resp_status_creator.create("STATUS_OK"));
};
