'use strict';

const ROUTE = '/v1';
const router = require('express').Router();
const multer = require('multer');
const fs = require('fs-extra');
const errorHandler = require('../helpers/errorhandler');


module.exports = function(app) {
    const Authorize = require('../helpers/authorize')(app);
    let Main = require('../service/main')(app);
    let Rules = require('../service/rules')(app);
    let Logs = require('../service/logs')(app);

    var Openalpr = require('../service/openalpr')(app);
    //===================

    var storage = multer.diskStorage({
        destination: 'archive/',
        filename: function(req, file, cb) {
            cb(null, Date.now() + '_' + file.originalname);
        }
    });

    var upload = multer({
        storage: storage
    });

    router.post('/recognize/:tag', Authorize.camera(), upload.single('image'), (req, res) => {
        console.log('Camera asset_tag valid. Image uploaded');
        console.log(req.file);

        Openalpr.connect(req.file.path).then(data => {

            //check licence plate with DB. Declare status.
            Rules.checkPlate(data.plate, req.params.tag, req.file.name).then(plate_check => {

                Rules.checkPolicy(plate_check).then(result => {
                    //save to logs
                    Logs.create(result).then((response) => {
                        //NEXT ITERATION save to stats!

                        //DELETE IMAGE > 10 entries old.
                        return res.json(result);

                    }).catch(errorHandler(res));

                }).catch(errorHandler(res));

            }).catch(errorHandler(res));

        }).catch(errorHandler(res));
    }); //app.post



    app.use(ROUTE, router);
}; //end of module.exports
