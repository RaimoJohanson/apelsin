'use strict';

const ROUTE = '/v1';
const ADMIN = 'ADMIN';
const router = require('express').Router();
const path = require('path');

module.exports = function(app) {

    const errorHandler = require('../helpers/errorhandler');
    const Authorize = require('../helpers/authorize')(app);
    const appRoot = app.get('rootPath');

    let Cameras = require('../service/cameras')(app);

    router.get('/realms/:rid/cameras', Authorize.realm(), function(req, res) {

        Cameras.read(req.params.rid).then(data => {

            res.json(data);

        }).catch(errorHandler(res));
    });

    router.post('/realms/:rid/cameras', Authorize.realm(ADMIN), function(req, res) {
        req.body.created_by = res.locals.user.id;

        Cameras.create(req.body, req.params.rid).then(data => {

            res.json(data);

        }).catch(errorHandler(res));

    });

    router.put('/realms/:rid/cameras/:cid', Authorize.realm(ADMIN), function(req, res) {
        req.body.updated_by = res.locals.user.id;

        Cameras.update(req.body, req.params.cid, req.params.rid).then(data => {
            res.json(data);
        }).catch(errorHandler(res));

    });

    router.delete('/realms/:rid/cameras/:camera_id', Authorize.realm(ADMIN), function(req, res) {

        Cameras.delete(req.params.camera_id, req.params.rid).then(data => {

            res.json(data);

        }).catch(errorHandler(res));

    });

    app.use(ROUTE, router);

};
