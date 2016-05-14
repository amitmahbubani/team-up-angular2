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

module.exports = router;