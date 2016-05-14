var router = require('express').Router();

router.all('/guest', function (req, res, next) {
    req.apiResponse = {
        access_token: Math.random().toString(36).substr(2)
    };
    next();
});

router.all('/home', function(req, res, next) {
    req.apiResponse = {
        
    };
    next();
});

module.exports = router;