'use strict';

const ROUTE = '/v1';
const router = require('express').Router();


var request = require('request');
const multer = require('multer');
const fs = require('fs');


module.exports = function(app) {
    const errorHandler = require('../helpers/errorhandler');

    const Authorize = require('../helpers/authorize')(app);
    let Logs = require('../service/logs')(app);
    let Main = require('../service/main')(app);
    //===================


    router.get('/realms/:rid/logs', Authorize.privileges(), function(req, res) {


        Logs.read(req.params.rid).then(result => {

            res.json(result);

        }).catch(errorHandler(res));

    }); //endpoint

    router.get('/realms/:rid/logs/:log_id', Authorize.privileges(), function(req, res) {


        Logs.readOne(req.params.rid, req.params.log_id).then(result => {

            res.json(result);

        }).catch(errorHandler(res));

    }); //endpoint




    app.use(ROUTE, router);
}; //end of module.exports
