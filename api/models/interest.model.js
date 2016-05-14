var interest = function () {

    var dataPath = {
        interest: __dirname + '/../data/interest.json',
    };

    var obj = {
        get: function (id, callback) {
            var interestData = require(dataPath.interest);

            if (interestData.hasOwnProperty(id)) {
                var resObj = interestData[id];
                resObj.id = id;
                callback(null, interestData[id]);
            } else {
                callback(null, {});
            }
        }
    };

    obj.search = function (queryString, callback) {
        var interestData = require(dataPath.interest);
        return this.get("int1", callback);
    };

    return obj;
};


module.exports = interest();