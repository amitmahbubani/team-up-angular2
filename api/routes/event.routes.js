var router = require('express').Router();

//Models
var eventModel = require(__dirname + '/../models/event.model');

router.all('/list', function (req, res, next) {
    var params = req.parsedParams;

    eventModel.getList(params, function (err, result) {
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

router.all('/create', function (req, res, next) {
    var params = req.parsedParams;
    params.organiser_id = req.parsedParams.user_id;
    params.city_id = "bangalore";
    eventModel.create(params, function (err, result) {
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