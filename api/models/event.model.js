var userModel = require('./user.model')
    , cityModel = require('./city.model');
var event = function () {

    function sortEvents(events, comparator) {
        return events.sort(comparator);
    }

    var obj = {
        exists: function (id) {
            var eventData = model('event');
            return eventData.hasOwnProperty(id);
        }
    };

    obj.getRaw = function (id) {
        if (this.exists(id)) {
            var eventData = model('event');
            return eventData[id];
        } else {
            return false
        }
    };

    obj.get = function (id, callback) {
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
            for (var userId in eventUserData[id]) {
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
    };

    obj.getList = function (params, callback) {
        var list = [];
        var eventData = model('event')
            , userEventData = model('user_event')
            , interestEventData = model('interest_event');
        var eventIds = (params.interest_id && interestEventData.hasOwnProperty(params.interest_id)) ? Object.keys(interestEventData[params.interest_id]) : Object.keys(eventData);
        var pendingEvents = eventIds.length;
        var userEvents = params.user_id ? userEventData[params.user_id] : {};
        for (var index in eventIds) {
            if (userEvents.hasOwnProperty(eventIds[index]) && userEvents[eventIds[index]].joined === true) {
                pendingEvents--;
                if (pendingEvents === 0) {
                    callback(null, list);
                }
            } else {
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
        }
    };

    obj.create = function (params, callback) {
        var eventData = model('event')
            , cityData = model('city')
            , interestData = model('interest')
            , userData = model('user');

        var questionParams = {};
        for (var questionId in params.questions) {
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
                return callback(err);
            }
            var eventUserMap = {};
            eventUserMap[insertParams.organiser_id] = {
                joined: true,
                request_pending: false,
                rating: 1
            };
            utils.writeToFile(eventId, eventUserMap, 'event_user', function (err) {
                if (err) {
                    utils.deleteFileObj('event', eventId, function (err) {
                    });
                    return callback({
                        err: err,
                        msg: 'Transaction failed'
                    });
                }
                utils.updateFileObj(insertParams.organiser_id, eventId, eventUserMap[insertParams.organiser_id], 'user_event', function (err) {
                    if (err) {
                        utils.deleteFileObj('event', eventId, function (err) {
                            utils.deleteFileObj('event_user', eventId, function (err) {

                            });
                        });

                        return callback({
                            err: err,
                            msg: 'Transaction failed'
                        });
                    }
                    utils.updateFileObj(insertParams.interest_id, eventId, {}, 'interest_event', function (err) {
                        if (err) {
                            utils.deleteFileObj('event', eventId, function (err) {
                                utils.deleteFileObj('event_user', eventId, function (err) {
                                    utils.deleteFileObj('user_event', insertParams.organiser_id, eventId, function (err) {

                                    });
                                });
                            });
                            return callback({
                                err: err,
                                msg: 'Transaction failed'
                            });
                        }
                        callback(null, {
                            success: true
                        });
                    });
                });
            });
        });
    };

    obj.requestEvent = function (id, user_id, callback) {
        var event = this.getRaw(id);
        if (event.organiser_id && event.organiser_id != user_id) {
            if (event.blocked_members.hasOwnProperty(user_id)) {
                callback({
                    err: "You don't have an access to join this activity",
                    msg: "Action unauthorized"
                });
            } else {
                var obj = {
                    "joined": true,
                    "request_pending": false,
                    "rating": 1
                };

                utils.updateFileObj(id, user_id, obj, 'event_user', function (err) {
                    if (err) {
                        callback({
                            err: err,
                            msg: "Unable to request"
                        });
                    } else {
                        utils.updateFileObj(user_id, id, obj, 'user_event', function (err) {
                            if (err) {
                                callback({
                                    err: err,
                                    msg: "Unable to request"
                                });
                            } else {
                                callback(null, {
                                    success: true
                                });
                            }
                        });
                    }
                })
            }
        } else {
            callback({
                err: "Either event does not exists or organiser id is not found",
                msg: "Invalid event"
            });
        }
    };

    obj.trendingEvents = function (params, callback) {
        var noOfResults = params.count || 6
            , eventUserData = model('event_user');

        var trendingEvents = [];
        for (var eventId in eventUserData) {
            trendingEvents.push({
                eventId: eventId,
                numberOfUsers: Object.keys(eventUserData[eventId]).length
            });
        }
        trendingEvents = sortEvents(trendingEvents, function (a, b) {
            return a.numberOfUsers - b.numberOfUsers;
        });
        trendingEvents = trendingEvents.slice(0, noOfResults);

        var pendingRequests = trendingEvents.length;
        var events = [];
        for (var index in trendingEvents) {
            var eventId = trendingEvents[index].eventId;
            this.get(eventId, function (err, result) {
                pendingRequests--;
                if (!err) {
                    events.push(result);
                }
                if (pendingRequests === 0) {
                    callback(null, events);
                }
            });
        }
    };

    return obj;
};

module.exports = event();