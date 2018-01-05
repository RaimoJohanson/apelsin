'use strict';

const ROUTE = '/v1';
var router = require('express').Router();
var errorHandler = require('../helpers/errorhandler');

module.exports = function(app) {
    var Authorize = require('../helpers/authorize')(app);
    var Upload = require('../helpers/upload')(app);
    var Rules = require('../service/rules')(app);
    var Logs = require('../service/logs')(app);
    var Openalpr = require('../service/openalpr')(app);

    router.post('/recognize/:tag', Authorize.camera(), Upload.image, (req, res) => {

        console.log(req.file);
        if (!req.file) return res.status(412).json('File not uploaded');

        Openalpr.connect(req.file.path).then(data => {
            //check licence plate with DB. Declare status.
            Rules.checkPlate(data.plate, req.params.tag, req.file.filename).then(plate_check => {

                Rules.checkPolicy(plate_check).then(result => {
                    //save to logs
                    Logs.create(result).then((response) => {

                        //DELETE IMAGE > 10 entries old.
                        return res.json(result);

                    }).catch(errorHandler(res));

                }).catch(errorHandler(res));

            }).catch(errorHandler(res));

        }).catch(errorHandler(res));
    });

    router.put('/recognize/:code', /*Authorize.gate(),*/ (req, res) => {

        res.json(req.params.code);

    }); //app.post


    app.use(ROUTE, router);
};
