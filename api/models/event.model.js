var userModel = require('./user.model')
    , cityModel = require('./city.model');
var event = function () {
    var dataPath = {
        user: __dirname + '/../data/user.json',
        event_user: __dirname + '/../data/event_user.json',
        event: __dirname + '/../data/event.json',
        interest: __dirname + '/../data/interest.json'
    };
    var obj = {
        get: function (id, callback) {
            var eventData = require(dataPath.event)
                , eventUserData = require(dataPath.event_user);

            var event = {};
            if (eventData.hasOwnProperty(id)) {
                var pendingRequests = 2 + Object.keys(eventUserData[id]).length;
                event = eventData[id];
                event.id = id;

                var blockedMembers = event.blocked_members;
                var organiserId = event.organiser_id;
                var cityId = event.city_id;

                delete event.organiser_id;
                delete event.city_id;

                event.blocked_members = [];
                event.approved_members = [];
                event.requested_members = [];
                event.organiser = {};
                event.city = {};

                userModel.profile(organiserId, function (err, result) {
                    if (!err) {
                        event.organiser = result;
                    }
                    pendingRequests--;
                    if (pendingRequests === 0) {
                        callback(null, event);
                    }
                });
                cityModel.get(cityId, function (err, result) {
                    if (!err) {
                        event.city = result;
                    }
                    pendingRequests--;
                    if (pendingRequests === 0) {
                        callback(null, event);
                    }
                });
                for (userId in eventUserData[id]) {
                    userModel.profile(userId, function (err, result) {
                        if (!err) {
                            if (blockedMembers.hasOwnProperty(result.id)) {
                                event.blocked_members.push(result);
                            } else if (eventUserData[id][result.id].request_pending === true) {
                                event.requested_members.push(result);
                            } else if (eventUserData[id][result.id].joined === true) {
                                event.approved_members.push(result);
                            }
                        }
                        pendingRequests--;
                        if (pendingRequests === 0) {
                            callback(null, event);
                        }
                    });
                }
            } else {
                return callback({
                    err: "No such user found",
                    msg: "Invalid user"
                });
            }
        }
    };

    obj.getList = function (params, callback) {

        var list = [];
        var eventIds = ["a"];
        var pendingEvents = eventIds.length;
        for (index in eventIds) {
            this.get(eventIds[index], function (err, result) {
                if (!err) {
                    list.push(result);
                }
                pendingEvents--;
                if (pendingEvents === 0) {
                    callback(null, list);
                }
            });
        }
    };

    return obj;
};


module.exports = event();