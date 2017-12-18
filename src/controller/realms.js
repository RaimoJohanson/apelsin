'use strict';

const ROUTE = '/v1';
const router = require('express').Router();





module.exports = function(app) {
    const errorHandler = require('../helpers/errorhandler');

    const Authorize = require('../helpers/authorize')(app);

    var Realms = require('../service/realms')(app);
    var Users = require('../service/users')(app);
    //===================


    router.get('/realms', function(req, res, next) {
        let cache = res.locals.user._realms_;
        let ids = [];
        Object.keys(cache).forEach(key => {
            ids.push(key);
        });
        Realms.landing(ids).then(realms => {
            realms.forEach(realm => {
                realm.role = cache[realm.id];
            });
            return res.json(realms);
        }).catch(errorHandler(res));

    }); //endpoint

    router.get('/realms/:rid', Authorize.realm(), function(req, res) {

        Realms.landing([req.params.rid]).then(realm => {
            realm[0].role = res.locals.user._realms_[realm[0].id];
            return res.json(realm[0]);
        }).catch(errorHandler(res));

    }); //endpoint

    router.put('/realms/:rid', Authorize.realm('OWNER'), function(req, res) {
        req.body.updated_by = res.locals.user.id;
        
        Realms.update(req.body, req.params.rid).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint
    router.post('/realms', function(req, res) {

        Realms.create(req.body, res.locals.user.id).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.delete('/realms/:rid', Authorize.realm('OWNER'), function(req, res) {

        Realms.delete(req.params.rid).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

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

    router.post('/realms/:rid/users', Authorize.realm('ADMIN'), function(req, res) {
        req.body.created_by = res.locals.user.id;

        Users.realm.create(req.body, req.params.rid, res.locals.user).then(result => {
            return res.json(result);
        }).catch(errorHandler(res));

    });

    router.put('/realms/:rid/users/:user_id', Authorize.realm('ADMIN'), function(req, res) {
        req.body.updated_by = res.locals.user.id;

        Users.realm.update(req.body, req.params.rid, req.params.user_id, res.locals.user).then(result => {
            return res.json(result);
        }).catch(errorHandler(res));

    });

    router.delete('/realms/:rid/users/:user_id', Authorize.realm('ADMIN'), function(req, res) {

        Users.realm.delete(req.params.rid, req.params.user_id, res.locals.user).then(result => {
            return res.json(result);
        }).catch(errorHandler(res));

    });

    app.use(ROUTE, router);
}; //end of module.exports
