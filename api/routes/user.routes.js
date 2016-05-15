var router = require('express').Router();

//Models
var userModel = require(__dirname + '/../models/user.model');

router.use(function (req, res, next) {
    req.is_authorized_page = true;
    next();
});

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


module.exports = router;