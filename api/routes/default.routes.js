var router = require('express').Router();

//Models
var interestModel = require(__dirname + '/../models/interest.model')
    , userModel = require(__dirname + '/../models/user.model')
    , eventModel = require(__dirname + '/../models/event.model');

router.all('/guest', function (req, res, next) {
    req.apiResponse = {
        access_token: Math.random().toString(36).substr(2)
    };
    next();
});

router.all('/search', function (req, res, next) {
    var searchString = decodeURI(req.parsedParams.q);

    interestModel.search(searchString, function (err, result) {
        if (err) {
            req.apiResponse = {
                error: err
            };
        } else {
            req.apiResponse = result;
        }
        next();
    });
});

router.all('/register', function (req, res, next) {
    var params = req.parsedParams;
    params.type = userModel.LOGIN_TYPE.normal;
    userModel.register(params, function (err, result) {
        if (err) {
            req.apiResponse = {
                error: err
            };
        } else {
            userModel.setSession(result.user_id, params.access_token);
            delete result.user_id;
            req.apiResponse = result;
        }
        next();
    });
});

router.all('/login', function (req, res, next) {
    var params = req.parsedParams;
    if (params.type == userModel.LOGIN_TYPE.fb) {
        userModel.facebookLogin(params, function (err, result) {
            if (err) {
                req.apiResponse = {
                    error: err
                };
            } else {
                userModel.setSession(result.user_id, params.access_token);
                delete result.user_id;
                req.apiResponse = result;
            }
            next();
        });
    } else if (params.type === userModel.LOGIN_TYPE.google) {

    } else if (params.type === userModel.LOGIN_TYPE.normal) {
        userModel.login(params, function (err, result) {
            if (err) {
                req.apiResponse = {
                    error: err
                }
            } else {
                userModel.setSession(result.user_id, params.access_token);
                delete result.user_id;
                req.apiResponse = result;
            }
            next();
        });
    } else {
        next();
    }
});

router.all('/home', function (req, res, next) {
    var pendingRequests = 3 - (req.parsedParams.user_id ? 0 : 1);
    req.apiResponse = {};
    if (req.parsedParams.user_id) {
        userModel.userEvents(req.parsedParams.user_id, function (err, result) {
            if (err) {
                req.apiResonse.error = err;
            } else {
                req.apiResponse.user_events = result;
            }
            pendingRequests--;
            if (pendingRequests === 0) {
                next();
            }
            eventModel.trendingEvents({}, function (err, result) {
                if (err) {
                    req.apiResonse.error = err;
                } else {
                    req.apiResponse.trending_events = result;
                    var userEventsLookup = {};
                    if (req.apiResponse.user_events.length > 0) {
                        for (var index in req.apiResponse.user_events) {
                            userEventsLookup[req.apiResponse.user_events[index].id] = true;
                        }
                        for (var index = 0; index < req.apiResponse.trending_events.length; index++) {
                            if (userEventsLookup.hasOwnProperty(req.apiResponse.trending_events[index].id)) {
                                req.apiResponse.trending_events.splice(index, 1);
                                index--;
                            }
                        }
                    }
                    req.apiResponse.trending_events.splice(req.parsedParams.rows || 6);
                }
                pendingRequests--;
                if (pendingRequests === 0) {
                    next();
                }
            });
        });
    } else {
        eventModel.trendingEvents({}, function (err, result) {
            if (err) {
                req.apiResonse.error = err;
            } else {
                req.apiResponse.trending_events = result.slice(0, req.parsedParams.rows || 6);
            }
            pendingRequests--;
            if (pendingRequests === 0) {
                next();
            }
        });
    }

    interestModel.list(function (err, result) {
        if (err) {
            req.apiResponse = {
                error: err
            };
        } else {
            req.apiResponse.interests = result;
        }
        pendingRequests--;
        if (pendingRequests === 0) {
            next();
        }
    });
});

router.all('/logout', function (req, res, next) {
    var previouslyPresent = false;
    if (userSessions.getFromId(req.parsedParams.user_id)) {
        userSessions.deleteSession(req.parsedParams.user_id);
        previouslyPresent = true;
    }
    req.apiResponse = {
        was_logged_in: previouslyPresent
    };
    req.is_authorized = false;
    next();
});

router.all('/interests', function (req, res, next) {
    interestModel.list(function (err, result) {
        if (err) {
            req.apiResponse = {
                error: err
            };
        } else {
            req.apiResponse = result;
        }
        next();
    });
});


module.exports = router;