'use strict';

const ROUTE = '/v1';
const router = require('express').Router();


var request = require('request');
const multer = require('multer');
const fs = require('fs');


module.exports = function(app) {
    const errorHandler = require('../helpers/errorhandler');

    const Authorize = require('../helpers/authorize')(app);

    let Users = require('../service/users')(app);
    //===================


    router.get('/users', Authorize.account('SUPER'), function(req, res, next) {

        Users.all().then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.get('/users/:user_id', Authorize.account('CLIENT'), function(req, res) {

        Users.read(req.params.user_id).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.post('/users', Authorize.account('SUPER'), function(req, res) {
        req.body.created_by = res.locals.user.id;

        Users.create(req.body).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.put('/users/:user_id', Authorize.account('CLIENT'), function(req, res) {
        req.body.updated_by = res.locals.user.id;

        Users.update(req.body, req.params.user_id).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.delete('/users/:user_id', Authorize.account('CLIENT'), function(req, res) {

        Users.delete(req.params.user_id).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint




    app.use(ROUTE, router);
}; //end of module.exports
