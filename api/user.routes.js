var router = require('express').Router();

router.get('/', function (req, res) {
    res.end("Hello user");
});

module.exports = router;