'use strict';

const ROUTE = '/v1';
const ADMIN = 'ADMIN';
const router = require('express').Router();

module.exports = function(app) {

    const errorHandler = require('../helpers/errorhandler');
    const Authorize = require('../helpers/authorize')(app);


    let cameras = require('../service/cameras')(app);

    router.get('/realms/:rid/cameras', Authorize.privileges(), function(req, res) {

        cameras.read(req.params.rid).then(data => {
            res.json(data);
            // res.render('vehicles', data);
        }).catch(errorHandler(res));
    }); //end of app.get

    router.post('/realms/:rid/cameras', Authorize.privileges(ADMIN), function(req, res) {

        cameras.create(req.body, req.params.rid).then(result => {

            res.json(result);

        }).catch(errorHandler(res));

    }); //end of endpoint

    router.put('/realms/:rid/cameras/:cid', Authorize.privileges(ADMIN), function(req, res) {

        cameras.update(req.body, req.params.vid, req.params.rid).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //end of endpoint

    router.delete('/realms/:rid/cameras/:camera_id', Authorize.privileges(ADMIN), function(req, res) {

        cameras.delete(req.params.camera_id, req.params.rid).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //end of endpoint

    app.use(ROUTE, router);

}; //end of module.exports
