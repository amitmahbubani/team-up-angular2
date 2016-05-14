var city = function () {
    var dataPath = {
        city: __dirname + '/../data/city.json'
    };

    return {
        get: function (id, callback) {
            var cityData = require(dataPath.city);
            if (cityData.hasOwnProperty(id)) {
                var obj = cityData[id];
                obj.id = id;
                callback(null, obj);
            } else {
                callback({
                    err: "City Id not found",
                    msg: "Invalid city"
                });
            }
        }
    };
};

module.exports = city();