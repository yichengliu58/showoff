// Author: Yicheng Liu
// yliu272@sheffield.ac.uk
// Response status is used to indicate a operation's result
// This is a tool to build a response status json

var RESP_STATUS = {
    // success
    STATUS_OK: {err: "", code: 0}
};

exports.create = function (status) {
    return RESP_STATUS[status];
};