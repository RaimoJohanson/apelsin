'use strict';

const ROUTE = '/v1';
const ADMIN = 'ADMIN';
const router = require('express').Router();

module.exports = function(app) {

    const errorHandler = require('../helpers/errorhandler');
    const Authorize = require('../helpers/authorize')(app);


    let vehicles = require('../service/vehicles')(app);

    router.get('/realms/:rid/vehicles', Authorize.realm(), function(req, res) {

        vehicles.read(req.params.rid).then(data => {
            res.json(data);
        }).catch(errorHandler(res));
    }); //end of app.get


    router.get('/realms/:rid/vehicles/:vid', Authorize.realm(), function(req, res) {

        vehicles.read(req.params.rid, req.params.vid).then(data => {
            res.json(data);
            // res.render('vehicles', data);
        }).catch(errorHandler(res));
    }); //end of app.get

    router.post('/realms/:rid/vehicles', Authorize.realm(ADMIN), function(req, res) {

        vehicles.create(req.body, req.params.rid).then(result => {

            res.json(result);

        }).catch(errorHandler(res));

    }); //end of endpoint

    router.put('/realms/:rid/vehicles/:vid', Authorize.realm(ADMIN), function(req, res) {

        vehicles.update(req.body, req.params.vid, req.params.rid).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //end of endpoint

    router.delete('/realms/:rid/vehicles/:vehicle_id', Authorize.realm(ADMIN), function(req, res) {

        vehicles.delete(req.params.vehicle_id, req.params.rid).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //end of endpoint
    router.get('/realms/:rid/vehicles/search/autocomplete', Authorize.realm(), function(req, res) {

        vehicles.autocomplete(req.query.input, req.params.rid).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //end of endpoint

    app.use(ROUTE, router);

}; //end of module.exports
