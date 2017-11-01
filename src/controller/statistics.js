'use strict';

const ROUTE = '/v1';
const router = require('express').Router();

module.exports = function(app) {
    const errorHandler = require('../helpers/errorhandler');

    const Authorize = require('../helpers/authorize')(app);
    let Statistics = require('../service/statistics')(app);
    let Main = require('../service/main')(app);
    //===================


    router.get('/realms/:rid/statistics', Authorize.privileges(), function(req, res) {

        Statistics.generate2(req.params.rid, req.query).then(result => {

            res.json(result);

        }).catch(errorHandler(res));

    }); //endpoint






    app.use(ROUTE, router);
}; //end of module.exports
