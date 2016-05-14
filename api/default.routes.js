var router = require('express').Router();


router.get('/', function (req, res) {
    res.end('Default user');
});

module.exports = router;