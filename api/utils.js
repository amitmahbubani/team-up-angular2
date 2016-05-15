var fs = require('fs');

function getDeletedObj(obj, attr) {
    if (typeof obj === 'undefined') {
        return false;
    } else if (attr.length === 0) {
        return true;
    } else {
        var key = attr[0];
        var isArray = false;
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            for (index in obj) {
                if (obj[index].id === attr[0]) {
                    key = index;
                }
            }
            isArray = true;
        }
        var objectFound = getDeletedObj(obj[key], attr.slice(1));
        if (objectFound === false) {
            return false;
        } else if (objectFound === true) {
            if (isArray) {
                obj.splice(key, 1);
            } else {
                delete obj[key];
            }
        } else {
            obj[key] = objectFound;
        }
        return obj;
    }
}

module.exports = {
    logMessage: function (msg, obj) {
        console.log(msg);
        if (obj) {
            console.log(obj);
        }
    },
    writeToFile: function (id, object, modelName, callback) {
        var fileName = __dirname + '/data/' + modelName + '.json';
        var modelData = model(modelName);
        if (modelData.hasOwnProperty(id)) {
            callback({
                err: 'Object of id "' + id + '" already exists in ' + model + '.json file',
                msg: 'Could not insert, integrity failed'
            });
        } else {
            modelData[id] = object;
            fs.writeFile(fileName, JSON.stringify(modelData, null, '  '), function (err) {
                if (err) {
                    return callback(err);
                }
                callback();
            });
        }
    },
    updateFileObj: function (id, objectId, object, modelName, callback) {
        var fileName = __dirname + '/data/' + modelName + '.json';
        var modelData = model(modelName);
        if (modelData.hasOwnProperty(id)) {
            modelData[id][objectId] = object;
            fs.writeFile(fileName, JSON.stringify(modelData, null, '  '), function (err) {
                if (err) {
                    return callback(err);
                }
                callback();
            });
        } else {
            callback({
                err: 'Object of id "' + id + '" does not exists in ' + modelName + '.json file',
                msg: 'Could not update, integrity failed'
            });
        }
    },
    deleteFileObj: function (modelName) {
        var arguments = Array.prototype.slice.call(arguments);
        var filename = __dirname + '/data/' + modelName + '.json';
        var modelData = model(modelName);
        var deletedObj = getDeletedObj(modelData, arguments.slice(1, arguments.length - 1));
        if (deletedObj === false) {
            arguments[arguments.length - 1]({
                err: "Could not delete from " + modelName,
                msg: "Some error occurred in rollback"
            });
        } else {
            fs.writeFile(filename, JSON.stringify(deletedObj, null, '  '), arguments[arguments.length - 1]);
        }
    }
};