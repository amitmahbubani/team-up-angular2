var userModel = require('./user.model')
    , cityModel = require('./city.model')
    , utils = require(__dirname + '/../utils');
var event = function () {
    var obj = {
        get: function (id, callback) {
            var eventData = model('event')
                , eventUserData = model('event_user');

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
        var eventData = model('event');
        var eventIds = Object.keys(eventData);
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

    obj.create = function (params, callback) {
        var eventData = model('event')
            , cityData = model('city')
            , interestData = model('interest')
            , userData = model('user');

        var questionParams = {};
        for (questionId in params.questions) {
            questionParams[questionId] = {
                ans: params.questions[questionId]
            };
        }
        var insertParams = {
            interest_id: params.interest_id,
            organiser_id: params.user_id,
            city_id: params.city_id,
            questions: questionParams,
            name: params.name,
            description: params.description,
            event_start_date: params.event_start_date || '',
            event_end_date: params.event_end_date || '',
            location: params.location || '',
            event_pic: params.event_pic || '',
            blocked_members: {},
            total_likes: 0,
            total_dislikes: 0
        };
        if (!cityData.hasOwnProperty(insertParams.city_id)
            || !interestData.hasOwnProperty(insertParams.interest_id)
            || !userData.hasOwnProperty(insertParams.organiser_id)
        ) {
            return callback({
                err: 'city_id, interest_id or user_id provided is not valid',
                msg: "Improper data supplied"
            });
        }
        do {
            var eventId = Math.random().toString(36).substr(2, 10);
        } while (eventData.hasOwnProperty(eventId));

        utils.writeToFile(eventId, insertParams, 'event', function (err) {
            if (err) {
                console.log("error", err);
            }
            console.log('written to event');
        });

        var eventUserMap = {};
        eventUserMap[insertParams.organiser_id] = {
            joined: true,
            request_pending: false,
            rating: 1
        };
        utils.writeToFile(eventId, eventUserMap, 'event_user', function (err) {
            if (err) {
                console.log("error", err);
            }
            console.log('written to event_user');
        });
        utils.updateFileObj(insertParams.organiser_id, eventId, eventUserMap[insertParams.organiser_id], 'user_event', function (err) {
            if (err) {
                console.log("error", err);
            }
            console.log('written to user_event');
        });

        callback(null, {
            success: true
        });
    };

    return obj;
};

module.exports = event();