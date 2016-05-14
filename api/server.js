var express = require('express')
    , app = express()
    , bodyParser = require('body-parser')
    , mysql = require('mysql');


//Utility objects
var config = require('./config.json')
    , utils = require('./utils');

app.locals.mysqlConn = {};
app.locals.mysqlConnectionStatus = false;
app.listen(config.port, function (err) {
    if (err) {
        return console.log("Server init error ", err);
    }
    createMysqlConnection(function (err) {
        "use strict";
        if (err) {
            utils.logMessage('Mysql Connection failed');
            process.exit();
        } else {
            utils.logMessage('Mysql connected');
        }
    });

    console.log("Server initiated at: " + config.port);
});

function createMysqlConnection(callback) {
    "use strict";
    app.locals.mysqlConn = mysql.createConnection({
        host: config.mysql.host,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.db
    });

    app.locals.mysqlConn.connect(function (err) {
        if (err) {
            err.target = "Mysql Connection problem";
            return callback(err);
        }
        app.locals.mysqlConnectionStatus = true;
        callback(null);
    });

    app.locals.mysqlConn.on('error', function (err) {
        "use strict";
        utils.logMessage('Mysql Connection lost', err);
    });

    app.locals.mysqlConn.on('end', function (err) {
        "use strict";

        app.locals.mysqlConnectionStatus = false;
        if (err) {
            utils.logMessage('Connection end error', err);
        }
        setTimeout(function () {
            createMysqlConnection(function (err) {
                if (err) {
                    utils.logMessage('Reconnecting to mysql caused an error', err);
                } else {
                    utils.logMessage('Mysql Connection restablished.');
                }
            });
        }, config.mysql.reconnectInterval || 2000);
    });
}


//Routes
var publicRoutes = require('./routes/default.routes')
    , userRoutes = require('./routes/user.routes')
    , eventRoutes = require('./routes/event.routes');

app.use(bodyParser.json());
app.use(function (req, res, next) {
    var params = req.params;
    var queryString = req.query;
    for (key in queryString) {
        params[key] = queryString[key];
    }
    req.parsedParams = params;
    next();
});
app.use('/', publicRoutes);
app.use('/user', userRoutes);
app.use('/event', eventRoutes);

app.use(function (req, res, next) {
    if (!req.apiResponse) {
        next();
    } else {
        if (req.apiResponse.error) {
            var error = req.apiResponse.error;
            res.end(JSON.stringify({
                error: error.err,
                errorMessage: error.msg
            }));
        } else {
            res.end(JSON.stringify(req.apiResponse));
        }
    }
});
//Error handler
app.use('/', function (req, res) {
    res.end(JSON.stringify({
        error: "Invalid method",
        errorMessage: "Invalid api request"
    }));
});