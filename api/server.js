var express = require('express')
    , bodyParser = require('body-parser')
    , mysql = require('mysql')
    , serveFavicon = require('serve-favicon');

app = express();
//Utility objects
config = require('./config.json')
model = require('./models/model');
utils = require('./utils');
userSessions = new utils.userSessions();

app.set('mysqlConn', {});
app.set('mysqlConnectionStatus', false);

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

app.use(serveFavicon(__dirname + '/../app/assets/images/logo.png'));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});
app.use(function (req, res, next) {
    var params = req.params;
    var queryString = req.query;
    for (key in queryString) {
        params[key] = queryString[key];
    }
    for (key in req.body) {
        params[key] = req.body[key];
    }
    params.access_token = req.header('Authorization') || params['Authorization'] || null;
    delete params['Authorization'];
    req.parsedParams = params;
    console.log(req.url, req.parsedParams.access_token);
    next();
});
app.use(/^\/((?!(guest|error)).)*$/, function (req, res, next) {
    if (!req.parsedParams.access_token) {
        res.redirect('/error');
    } else {
        next();
    }
});
app.use(function (req, res, next) {
    if (userSessions.getFromToken(req.parsedParams.access_token)) {
        req.is_authorized = true
        req.parsedParams.user_id = userSessions.getFromToken(req.parsedParams.access_token);
    } else {
        req.is_authorized = false;
    }
    /*
     To remove
     */
    // req.is_authorized = true;
    // req.parsedParams.user_id = 2;
    next();
});
app.use('/', publicRoutes);
app.use('/user', userRoutes);
app.use('/event', eventRoutes);
app.use(function (req, res, next) {
    if (userSessions.getFromToken(req.parsedParams.access_token)) {
        req.is_authorized = true
    } else {
        req.is_authorized = false;
    }
    if (!req.is_authorized && req.is_authorized_page) {
        req.apiResponse = {
            error: {
                err: "Not authorized",
                msg: "Invalid request"
            }
        };
    }
    next();
});
app.use(function (req, res, next) {
    if (!req.apiResponse) {
        next();
    } else {
        var response;
        if (req.apiResponse.error) {
            var error = req.apiResponse.error;
            response = {
                error: error.err,
                errorMessage: error.msg,
                success: false
            };
        } else {
            response = {
                response: req.apiResponse
            };
            response.success = true;
        }
        response.authenticated = req.is_authorized;
        res.end(JSON.stringify(response));
    }
});
//Error handler
app.use('/', function (req, res) {
    res.end(JSON.stringify({
        error: "Invalid method",
        errorMessage: "Invalid api request",
        success: false,
        authenticated: req.is_authorized
    }));
});