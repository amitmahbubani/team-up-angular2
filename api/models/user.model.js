var fb = require('fb');

var user = function () {
    var obj = {
        LOGIN_TYPE: {
            normal: 1,
            fb: 2,
            google: 3
        },
        getUserIdByEmail: function (email) {
            var userData = model('user');
            for (id in userData) {
                if (userData[id].email === email) {
                    return id;
                }
            }
            return false;
        },
        profile: function (id, callback) {
            var userData = model('user');
            if (userData.hasOwnProperty(id)) {
                var obj = userData[id];
                obj.id = id;
                callback(null, obj);
            } else {
                callback({
                    err: "No such user found",
                    msg: "Invalid user"
                });
            }
        },
        userEvents: function (id, callback) {
            var userEventData = model('user_event')
                , eventData = model('event');

            if (userEventData.hasOwnProperty(id)) {
                var userEventList = userEventData[id];
                var userEvents = [];
                for (var eventId in userEventList) {
                    info = userEventList[eventId];
                    if (eventData.hasOwnProperty(eventId)) {
                        var obj = eventData[eventId];
                        obj.id = eventId;
                        obj.joined = info.joined;
                        obj.like = (info.rating && info.rating > 0) ? true : false;
                        obj.disliked = (info.rating && info.rating < 0) ? true : false;
                        obj.no_action = (!info.rating) ? true : false;
                        userEvents.push(obj);
                    }
                }
                callback(null, userEvents);
            } else {
                callback(null, []);
            }
        },
        setSession: function (userId, token) {
            userSessions.setSession(token, userId);
        }
    };

    obj.register = function (params, callback) {
        var userId = this.getUserIdByEmail(params.email);
        if (userId !== false) {
            if (params.type === this.LOGIN_TYPE.normal) {
                return callback({
                    err: "User already registered",
                    msg: "User already exists"
                });
            } else {
                return callback(null, {
                    is_new_user: false,
                    user_id: userId
                });
            }
        } else {
            userId = Math.random().toString(36).substr(2, 10);
            var userObj = {
                name: params.name || (params.first_name + ' ' + params.last_name),
                email: params.email,
                password: params.password || '',
                events: [],
                default_location: '',
                profile_pic: ''
            };
            utils.writeToFile(userId, userObj, 'user', function (err) {
                if (err) {
                    return callback({
                        err: err.err,
                        msg: "User register failed"
                    })
                }
                utils.writeToFile(userId, {}, 'user_event', function (err) {
                    if (err) {
                        utils.deleteFileObj('user', userId, function () {
                        });
                        return callback({
                            err: err.err,
                            msg: "User registration for activities failed"
                        });
                    }
                    return callback(null, {
                        is_new_user: false,
                        user_id: userId
                    });
                });
            })
        }
    };

    obj.login = function (params, callback) {
        var userId = this.getUserIdByEmail(params.email);
        if (userId !== false) {
            var user = model('user')[userId];

            if (user.password !== params.password) {
                return callback({
                    err: "Password do not match, email present",
                    msg: "Invalid credentials"
                });
            } else {
                return callback(null, {
                    user_id: userId
                });
            }
        }
    };

    obj.facebookLogin = function (params, callback) {
        var thisObj = this;
        fb.options(config.fb);
        fb.setAccessToken(params.fb_access_token);
        fb.api('/me', {
            fields: [
                'id',
                'first_name',
                'last_name',
                'gender',
                'email',
                'birthday'
            ]
        }, function (result) {
            if (result.error) {
                callback({
                    err: result.error.message,
                    msg: "Facebook data fetching failed"
                })
            } else {
                thisObj.register(result, function (err, response) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, response);
                    }
                });
            }
        });
    };


    return obj;
};


module.exports = user();