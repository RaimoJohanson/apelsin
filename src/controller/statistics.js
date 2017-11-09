'use strict';

const ROUTE = '/v1';
const router = require('express').Router();

module.exports = function(app) {
    const errorHandler = require('../helpers/errorhandler');

    const Authorize = require('../helpers/authorize')(app);
    let Statistics = require('../service/statistics')(app);
    let Main = require('../service/main')(app);
    //===================


    router.get('/realms/:rid/statistics/today', Authorize.realm(), function(req, res) {
        Statistics.interactions.today(req.params.rid).then(result => {
            res.json(result);
        }).catch(errorHandler(res));
    }); //endpoint






    app.use(ROUTE, router);
}; //end of module.exports
