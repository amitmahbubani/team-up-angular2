var express = require('express')
    , app = express()
    , config = require('./config.json')
    , bodyParser = require('body-parser')
    , mysql = require('mysql');

app.locals.mysqlConn = {};
app.locals.mysqlConnectionStatus = false;
app.listen(config.port, function (err) {
    if (err) {
        return console.log("Server init error ", err);
    }
    createMysqlConnection(function (err) {
        "use strict";
        if (err) {
            console.log('Mysql Connection failed');
            process.exit();
        } else {
            console.log('Mysql connected');
        }
    });

    console.log("Server initiated at: " + config.port);
});
function logMessage(msg, obj) {
    console.log(msg);
    if (obj) {
        console.log(obj);
    }
}

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
        logMessage('Mysql Connection lost', err);
    });

    app.locals.mysqlConn.on('end', function (err) {
        "use strict";

        app.locals.mysqlConnectionStatus = false;
        if (err) {
            logMessage('Connection end error', err);
        }
        setTimeout(function () {
            createMysqlConnection(function (err) {
                if (err) {
                    logMessage('Reconnecting to mysql caused an error', err);
                } else {
                    logMessage('Mysql Connection restablished.');
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
app.use('/', publicRoutes);
app.use('/user', userRoutes);
app.use('/event', eventRoutes);