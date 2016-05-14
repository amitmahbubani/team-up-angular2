var router = require('express').Router();

//Models
var userModel = require(__dirname + '/../models/user');

router.use(function (req, res, next) {
    req.isAuthorized = true;
    next();
});

router.get('/profile', function (req, res, next) {
    if (!req.isAuthorized) {
        req.apiResponse = {
            error: {
                err: "Not authorized",
                msg: "Invalid request"
            }
        };
        return next();
    }
    var params = req.parsedParams;
    userModel.profile(params.id, function (err, result) {
        req.apiResponse = result;
        next();
    });
});

module.exports = router;