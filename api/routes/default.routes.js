var router = require('express').Router()
    , fb = require('fb');


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
    fb.options(config.fb);

    fb.setAccessToken(params.fb_access_token);
    fb.api('/me', {
        fields: [
            'id',
            'first_name',
            'last_name',
            'gender',
            'email',
            'birthday'
        ]
    }, function (result) {
        if (result.error) {
            req.apiResponse = {
                error: {
                    err: result.error.message,
                    msg: "Facebook data fetching failed"
                }
            };
            next();
        } else {
            userModel.register(result, function (err, response) {
                if (err) {
                    req.apiResponse = {
                        error: err
                    };
                } else {
                    userModel.setSession(response.user_id, params.access_token);
                    delete response.user_id;
                    req.apiResponse = response;
                }
                next();
            });
        }
    });
});

module.exports = router;