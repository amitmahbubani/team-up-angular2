var router = require('express').Router();

//Models
var interestModel = require(__dirname + '/../models/interest.model')
    , userModel = require(__dirname + '/../models/user.model');

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
    console.log(params);
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

    } else {
        next();
    }
});

router.all('/login', function (req, res, next) {

});

module.exports = router;