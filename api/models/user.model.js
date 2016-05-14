var user = function () {

    var dataPath = {
        user: __dirname + '/../data/user.json',
        user_event: __dirname + '/../data/user_event.json',
        event: __dirname + '/../data/event.json'
    };
    return {
        profile: function (id, callback) {
            var userModel = require(dataPath.user);
            if (userModel.hasOwnProperty(id)) {
                callback(null, userModel[id]);
            } else {
                callback({
                    err: "No such user found",
                    msg: "Invalid user"
                });
            }
        },
        userEvents: function (id, callback) {
            var userEventModels = require(dataPath.user_event)
                , eventModels = require(dataPath.event);

            if (userEventModels.hasOwnProperty(id)) {
                var userEventList = userEventModels[id];
                var userEvents = [];
                for (var eventId in userEventList) {
                    info = userEventList[eventId];
                    if (eventModels.hasOwnProperty(eventId)) {
                        var obj = eventModels[eventId];
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
        }
    }
};


module.exports = user();