'use strict';

const ROUTE = '/v1';
const router = require('express').Router();
const path = require('path');

module.exports = function(app) {
    const errorHandler = require('../helpers/errorhandler');
    const Authorize = require('../helpers/authorize')(app);
    var Logs = require('../service/logs')(app);
    const appRoot = app.get('rootPath');
    router.get('/realms/:rid/logs', Authorize.realm(), function(req, res) {


        Logs.read(req.params.rid, req.query).then(result => {

            res.json(result);

        }).catch(errorHandler(res));

    }); //endpoint

    router.get('/realms/:rid/logs/:log_id', Authorize.realm(), function(req, res) {


        Logs.readOne(req.params.rid, req.params.log_id).then(result => {

            res.json(result);

        }).catch(errorHandler(res));

    }); //endpoint

    router.get('/realms/:rid/logs/:log_id/image', Authorize.realm(), function(req, res) {

        console.log(appRoot);

        Logs.getImage(req.params.rid, req.params.log_id).then(result => {

            console.log(path.join(appRoot, '/archive/', result[0].file_name));
            res.sendFile(path.join(appRoot, '/archive/', result[0].file_name));

        }).catch(errorHandler(res));

    }); //endpoint

    app.use(ROUTE, router);
}; //end of module.exports
