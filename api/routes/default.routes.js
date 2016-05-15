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
    var searchString = req.parsedParams.q;

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
    var pendingRequests = 2 - (req.parsedParams.user_id ? 0 : 1);
    req.apiResponse = {};
    eventModel.trendingEvents({}, function (err, result) {
        if (err) {
            req.apiResonse.error = err;
        } else {
            req.apiResponse.trending_events = result;
        }
        pendingRequests--;
        if (pendingRequests === 0) {
            next();
        }
    });
    if (req.parsedParams.user_id) {
        userModel.userEvents(req.parsedParams.user_id, function(err, result) {
            if (err) {
                req.apiResonse.error = err;
            } else {
                req.apiResponse.user_events = result;
            }
            pendingRequests--;
            if (pendingRequests === 0) {
                next();
            }
        });
    }
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


module.exports = router;