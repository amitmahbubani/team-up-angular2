var fs = require('fs');

module.exports = {
    logMessage: function (msg, obj) {
        console.log(msg);
        if (obj) {
            console.log(obj);
        }
    },
    writeToFile: function (id, object, model, callback) {
        var fileName = __dirname + '/data/' + model + '.json';
        var modelData = require(__dirname + '/data/' + model + '.json');
        if (modelData.hasOwnProperty(id)) {
            callback({
                err: 'Object of id "' + id + '" already exists in ' + model + '.json file',
                msg: 'Could not insert, integrity failed'
            });
        } else {
            modelData[id] = object;
            fs.writeFile(fileName, JSON.stringify(modelData, null, '  '), callback);
        }
    },
    updateFileObj: function (id, objectId, object, model, callback) {
        var fileName = __dirname + '/data/' + model + '.json';
        var modelData = require(__dirname + '/data/' + model + '.json');
        if (modelData.hasOwnProperty(id)) {
            modelData[id][objectId] = object;
            fs.writeFile(fileName, JSON.stringify(modelData, null, '  '), callback);
        } else {
            callback({
                err: 'Object of id "' + id + '" does not exists in ' + model + '.json file',
                msg: 'Could not update, integrity failed'
            });
        }
    }
};