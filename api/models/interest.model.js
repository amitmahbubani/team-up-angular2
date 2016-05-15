var interest = function () {
    var obj = {
        get: function (id, callback) {
            var interestData = model('interest');

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
        var interestData = model('interest');
        return this.get("int1", callback);
    };

    return obj;
};


module.exports = interest();