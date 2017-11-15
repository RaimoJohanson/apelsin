'use strict';
const CLIENT = 'CLIENT';
const SUPER = 'SUPER';
const ROUTE = '/v1';
const router = require('express').Router();


const moment = require('moment');


module.exports = function(app) {
    const errorHandler = require('../helpers/errorhandler');

    const Authorize = require('../helpers/authorize')(app);

    let Users = require('../service/users')(app);
    //===================
    

    router.get('/users', Authorize.account(SUPER), function(req, res, next) {

        Users.all().then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.get('/users/:user_id', Authorize.account(CLIENT), function(req, res) {

        Users.read(req.params.user_id).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.post('/users', Authorize.account(SUPER), function(req, res) {
        req.body.created_by = res.locals.user.id;
        req.body.created_at = moment().format("YYYY-MM-DD kk:mm:ss");

        Users.create(req.body).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.put('/users/:user_id', Authorize.account(CLIENT), function(req, res) {
        req.body.updated_by = res.locals.user.id;
        req.body.updated_at = moment().format("YYYY-MM-DD kk:mm:ss");

        Users.update(req.body, req.params.user_id).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.delete('/users/:user_id', Authorize.account(SUPER), function(req, res) {

        Users.delete(req.params.user_id).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    //========================================================================================
    //======================        REALM USERS          =====================================
    //========================================================================================
    router.get('/realms/:rid/users', Authorize.realm('ADMIN'), function(req, res) {

        Users.realm.all(req.params.rid).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.get('/realms/:rid/users/:user_id', Authorize.realm('ADMIN'), function(req, res) {

        Users.realm.find(req.params.rid, req.params.user_id).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.put('/realms/:rid/users/:user_id', Authorize.realm('ADMIN'), function(req, res) {

        Users.realm.update(req.body, req.params.rid, req.params.user_id).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint
    router.post('/realms/:rid/users', Authorize.realm('ADMIN'), function(req, res) {

        Users.realm.create(req.body, req.params.rid).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.delete('/realms/:rid/users/:user_id', Authorize.realm('ADMIN'), function(req, res) {

        Users.realm.delete(req.params.rid, req.params.user_id).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint


    app.use(ROUTE, router);
}; //end of module.exports
