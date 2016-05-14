var router = require('express').Router();


//Models
var interestModel = require(__dirname + '/../models/interest.model');

router.all('/guest', function (req, res, next) {
    req.apiResponse = {
        access_token: Math.random().toString(36).substr(2)
    };
    next();
});

router.all('/search', function (req, res, next) {
    var searchString = req.parsedParams.q;

    var response = {};
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

module.exports = router;