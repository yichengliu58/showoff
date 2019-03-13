// Response status is used to indicate a operation's result
// This is a tool to build a response status json

var RESP_STATUS = {
    // success
    STATUS_OK: {err: "", code: 0},
    STATUS_WRONG_PWD: {err: "login failed, wrong password", code: 1}
    // 列出可能出现的错误情况
};

exports.create = function (status) {
    return RESP_STATUS[status];
};