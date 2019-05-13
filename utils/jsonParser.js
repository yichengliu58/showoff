/**
 * utility function for parsing a json string
 * @param json string to be parsed
 * @return parsed object
 */
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
