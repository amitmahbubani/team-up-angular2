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

router.all('/request', function (req, res, next) {
    var params = req.parsedParams;
    if (eventModel.exists(params.event_id)) {
        eventModel.requestEvent(params.event_id, req.parsedParams.user_id, function (err, result) {
            if (err) {
                req.apiResponse = {
                    error: err
                };
            } else {
                req.apiResponse = result;
            }
            next();
        });
    } else {
        req.apiResponse = {
            error: {
                err: "No event of id " + params.event_id + " exists",
                msg: "Invalid event"
            }
        }
        next();
    }
});

module.exports = router;