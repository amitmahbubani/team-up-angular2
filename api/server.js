var app = require('express')()
    , config = require('./config.json')
    , mysql = require('mysql');

app.listen(config.port, function(err) {
    if(err) {
        return console.log("Server init error ", err);
    }
    console.log("Server initiated at: " + config.port);
});

