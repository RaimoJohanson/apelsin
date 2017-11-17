'use strict';

const ROUTE = '/v1';
const router = require('express').Router();





module.exports = function(app) {
    const errorHandler = require('../helpers/errorhandler');

    const Authorize = require('../helpers/authorize')(app);
    var Logs = require('../service/logs')(app);
    var Realms = require('../service/realms')(app);
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

    router.put('/realms/:rid', Authorize.realm('ADMIN'), function(req, res) {

        Realms.update(req.body, req.params.rid).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint
    router.post('/realms', function(req, res) {

        Realms.create(req.body, res.locals.user.id).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint

    router.delete('/realms/:rid', Authorize.realm('ADMIN'), function(req, res) {

        Realms.delete(req.params.rid).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //endpoint



    app.use(ROUTE, router);
}; //end of module.exports
