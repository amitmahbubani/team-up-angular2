var router = require('express').Router();


router.get('/', function (req, res) {
    res.end('Default user');
});

router.post('/login', function (req, res) {
    
});

module.exports = router;