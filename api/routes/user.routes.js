var router = require('express').Router();

//Models
var userModel = require(__dirname + '/../models/user');

router.all('/profile', function (req, res, next) {
    if (!req.is_authorized) {
        return next();
    }
    var params = req.parsedParams;
    userModel.profile(params.user_id, function (err, result) {
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

router.all('/events', function (req, res, next) {
    if (!req.is_authorized) {
        return next();
    }
    var params = req.parsedParams;
    userModel.userEvents(params.user_id, function (err, result) {
        if (err) {
            req.apiResponse = {
                error: err
            }
        } else {
            req.apiResponse = result;
        }
        next();
    })
});

router.all('/logout', function (req, res, next) {
    var previouslyPresent = false;
    if (userSessions.hasOwnProperty(req.parsedParams.user_id)) {
        delete userSessions[userSessions[req.parsedParams.user_id]];//remove access_token => id map
        delete userSessions[req.parsedParams.user_id]; //remove id => access_token map
        previouslyPresent = true;
    }
    req.apiResponse = {
        was_user_logged_in: previouslyPresent
    };
    req.is_authorized = false;
    next();
});

module.exports = router;