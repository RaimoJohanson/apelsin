'use strict';

const ROUTE = '/v1';
const router = require('express').Router();

module.exports = function(app) {
    const errorHandler = require('../helpers/errorhandler');
    const Authorize = require('../helpers/authorize')(app);
    var Logs = require('../service/logs')(app);

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




    app.use(ROUTE, router);
}; //end of module.exports
