// util function to parse a json string
exports.parseJSON = function(rawJson) {
    var res;
    try {
        res = JSON.parse(rawJson);
    } catch (e) {
        console.log("failed to parse json string: " + rawJson);
        return null;
    }

    return res;
};
