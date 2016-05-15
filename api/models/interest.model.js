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

    obj.list = function (callback) {
        var interestData = model('interest');
        var pendingRequests = Object.keys(interestData).length;
        var interestList = [];
        for (var interestId in interestData) {
            this.get(interestId, function (err, result) {
                if (!err) {
                    interestList.push(result);
                }
                pendingRequests--;
                if (pendingRequests === 0) {
                    callback(null, interestList);
                }
            });
        }
    };

    obj.search = function (queryString, callback) {
        var queryArr = queryString.split(' ');
        var interestData = model('interest');
        var interestScores = {};
        var keywordInterestMap = {};
        var maxScoreInterest = {
            score: -1,
            id: ''
        };
        for (var interestId in interestData) {
            var interest = interestData[interestId];
            interestScores[interestId] = 0;
            if (maxScoreInterest.score < interestScores[interestId]) {
                maxScoreInterest.score = interestScores[interestId];
                maxScoreInterest.id = interestId;
            }
            for (index in interest.keywords) {
                if (!keywordInterestMap[interest.keywords[index]]) {
                    keywordInterestMap[interest.keywords[index]] = {}
                }
                keywordInterestMap[interest.keywords[index]][interestId] = true;
            }
        }
        for (var index in queryArr) {
            var keyword = queryArr[index];
            if (keywordInterestMap.hasOwnProperty(keyword)) {
                for (var interestId in keywordInterestMap[keyword]) {
                    interestScores[interestId]++;
                    if (maxScoreInterest.score < interestScores[interestId]) {
                        maxScoreInterest.score = interestScores[interestId];
                        maxScoreInterest.id = interestId;
                    }
                }
            }
        }
        return this.get(maxScoreInterest.id, callback);
    };

    return obj;
};


module.exports = interest();