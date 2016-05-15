var fs = require('fs');

module.exports = function (modelName) {
    var fileName = __dirname + '/../data/' + modelName + '.json';
    if (fs.statSync(fileName).isFile()) {
        delete require.cache[require.resolve(fileName)];
        return JSON.parse(JSON.stringify(require(fileName)));
    } else {
        return false;
    }
};