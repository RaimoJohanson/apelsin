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


    router.get('/realms', function(req, res, next) {
        let cache = res.locals.user._realms_;
        let ids = [];
        Object.keys(cache).forEach(key => {
            ids.push(key);
        });
        Main.landing(ids).then(realms => {
            realms.forEach(realm => {
                realm.role = cache[realm.id];
            });
            return res.json(realms);
        }).catch(errorHandler(res));

    }); //endpoint

    router.get('/realms/:rid', Authorize.privileges(), function(req, res) {


        Main.dashboard(res.locals.user.id, req.params.rid).then(data => {
            res.json(data);
            //res.render('index.html', data);
        }).catch(err => {
            console.log(err);
            res.json(err);
        });

    }); //endpoint





    app.use(ROUTE, router);
}; //end of module.exports
