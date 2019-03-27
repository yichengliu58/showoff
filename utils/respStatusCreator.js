// Response status is used to indicate a operation's result
// This is a tool to build a response status json

var RESP_STATUS = {
    // success
    STATUS_OK: {err: "", code: 0},
    // password is wrong
    STATUS_WRONG_PWD: {err: "login failed, wrong password", code: 1},
    // json string is not parsable
    STATUS_WRONG_JSON: {err: "uploaded json string is not parsable", code: 2}
};

exports.create = function (status) {
    return RESP_STATUS[status];
};