var router = require('express').Router();

//Models
var userModel = require(__dirname + '/../models/user');

router.use(function (req, res, next) {
    req.isAuthorized = true;
    if (!req.isAuthorized) {
        req.apiResponse = {
            error: {
                err: "Not authorized",
                msg: "Invalid request"
            }
        };
    }
    next();
});

router.all('/profile', function (req, res, next) {
    if (!req.isAuthorized) {
        return next();
    }
    var params = req.parsedParams;
    userModel.profile(params.userId, function (err, result) {
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
    if (!req.isAuthorized) {
        return next();
    }
    var params = req.parsedParams;
    userModel.userEvents(params.userId, function (err, result) {
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

module.exports = router;