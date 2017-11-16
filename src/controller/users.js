'use strict';
const CLIENT = 'CLIENT',
    SUPER = 'SUPER',
    SELF = 'SELF',
    ADMIN = 'ADMIN';

const ROUTE = '/v1';
const router = require('express').Router();

const moment = require('moment');

module.exports = function(app) {
    const errorHandler = require('../helpers/errorhandler');

    const Authorize = require('../helpers/authorize')(app);

    let Users = require('../service/users')(app);
    //===================


    router.get('/users', Authorize.account(CLIENT), function(req, res, next) {
        if (!req.query.email) return next();

        Users.all(req.query).then(result => {
            return res.json(result);
        }).catch(errorHandler(res));

    }, Authorize.account(SUPER), function(req, res) {


        Users.all().then(result => {
            return res.json(result);
        }).catch(errorHandler(res));
    });

    router.get('/users/:user_id', Authorize.account(SELF), function(req, res) {
        console.log('here');
        Users.read(req.params.user_id).then(result => {
            return res.json(result);
        }).catch(errorHandler(res));

    });

    router.post('/users', Authorize.account(SUPER), function(req, res) {
        req.body.created_by = res.locals.user.id;
        req.body.created_at = moment().format("YYYY-MM-DD kk:mm:ss");

        Users.create(req.body).then(result => {
            return res.json(result);
        }).catch(errorHandler(res));

    });

    router.put('/users/:user_id', Authorize.account(SELF), function(req, res) {
        req.body.updated_by = res.locals.user.id;
        req.body.updated_at = moment().format("YYYY-MM-DD kk:mm:ss");

        Users.update(req.body, req.params.user_id).then(result => {
            return res.json(result);
        }).catch(errorHandler(res));

    });

    router.delete('/users/:user_id', Authorize.account(SUPER), function(req, res) {

        Users.delete(req.params.user_id).then(result => {
            return res.json(result);
        }).catch(errorHandler(res));

    });

    //========================================================================================
    //======================        REALM USERS          =====================================
    //========================================================================================
    router.get('/realms/:rid/users', Authorize.realm('ADMIN'), function(req, res) {

        Users.realm.all(req.params.rid).then(result => {
            return res.json(result);
        }).catch(errorHandler(res));

    });

    router.get('/realms/:rid/users/:user_id', Authorize.realm('ADMIN'), function(req, res) {

        Users.realm.find(req.params.rid, req.params.user_id).then(result => {
            return res.json(result);
        }).catch(errorHandler(res));

    });

    router.put('/realms/:rid/users/:user_id', Authorize.realm('ADMIN'), function(req, res) {

        Users.realm.update(req.body, req.params.rid, req.params.user_id).then(result => {
            return res.json(result);
        }).catch(errorHandler(res));

    });

    router.post('/realms/:rid/users', Authorize.realm('ADMIN'), function(req, res) {

        Users.realm.create(req.body, req.params.rid).then(result => {
            return res.json(result);
        }).catch(errorHandler(res));

    });

    router.delete('/realms/:rid/users/:user_id', Authorize.realm('ADMIN'), function(req, res) {

        Users.realm.delete(req.params.rid, req.params.user_id).then(result => {
            return res.json(result);
        }).catch(errorHandler(res));

    });

    app.use(ROUTE, router);
};
