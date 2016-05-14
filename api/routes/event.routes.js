var router = require('express').Router();

router.get('/', function(req, res) {
    res.end('Event route');
});

module.exports = router;