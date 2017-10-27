'use strict';

const ROUTE = '/v1';
const router = require('express').Router();


var request = require('request');
const multer = require('multer');
const fs = require('fs');


module.exports = function(app) {
    const errorHandler = require('../helpers/errorhandler');

    const Authorize = require('../helpers/authorize')(app);

    let Rules = require('../service/rules')(app);
    //===================


    router.get('/realms/:rid/rules', Authorize.privileges(), function(req, res, next) {

        Rules.all(req.params.rid).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.get('/realms/:rid/rules/:rule_id', Authorize.privileges(), function(req, res) {

        Rules.read(req.params.rid, req.params.rule_id).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.post('/realms/:rid/rules', Authorize.privileges('ADMIN'), function(req, res) {
        req.body.created_by = res.locals.user.id;

        Rules.create(req.body, req.params.rid).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.put('/realms/:rid/rules/:rule_id', Authorize.privileges('ADMIN'), function(req, res) {
        req.body.updated_by = res.locals.user.id;

        Rules.update(req.body, req.params.rid, req.params.rule_id).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.delete('/realms/:rid/rules/:rule_id', Authorize.privileges('ADMIN'), function(req, res) {

        Rules.delete(req.params.user_id).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint




    app.use(ROUTE, router);
}; //end of module.exports
