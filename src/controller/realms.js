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
        Realms.dashboard(res.locals.user.id, req.params.rid).then(data => {
            res.json(data);
            //res.render('index.html', data);
        }).catch(err => {
            console.log(err);
            res.json(err);
        });

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
