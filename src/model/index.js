'use strict';

var fs = require("fs");
var path = require("path");

// Getting all model files while excluding itself
// ==============================================
module.exports = function(app) {
    app.locals.model = {};
    //app.locals.logger.data('Requiring "model" files:');
    console.log('Requiring "model" files:');
    fs.readdirSync(__dirname).forEach(function(file) {
        if (file.substr(-3) == '.js' && file != path.basename(__filename)) {

            app.locals.model[path.parse(file).name] = require(__dirname + '/' + file)(app);

        }
    });

};
