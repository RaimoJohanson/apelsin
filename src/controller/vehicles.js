'use strict';

const ROUTE = '/v1';
const ADMIN = 'ADMIN';
const router = require('express').Router();

module.exports = function(app) {

    const errorHandler = require('../helpers/errorhandler');
    const Authorize = require('../helpers/authorize')(app);


    let vehicles = require('../service/vehicles')(app);

    router.get('/realms/:rid/vehicles', Authorize.realm(), function(req, res) {

        if (req.query.input) vehicles.autocomplete(req.query.input, req.params.rid).then(result => {
            return res.json(result);
        }).catch(errorHandler(res));

        else vehicles.read(req.params.rid).then(data => {
            return res.json(data);
        }).catch(errorHandler(res));

    }); //end of app.get


    router.get('/realms/:rid/vehicles/:vid', Authorize.realm(), function(req, res) {

        vehicles.read(req.params.rid, req.params.vid).then(data => {
            res.json(data);
            // res.render('vehicles', data);
        }).catch(errorHandler(res));
    }); //end of app.get

    router.post('/realms/:rid/vehicles', Authorize.realm(ADMIN), function(req, res) {
        req.body.created_by = res.locals.user.id;
        vehicles.create(req.body, req.params.rid).then(result => {

            res.json(result);

        }).catch(errorHandler(res));

    }); //end of endpoint

    router.put('/realms/:rid/vehicles/:vid', Authorize.realm(ADMIN), function(req, res) {
        req.body.updated_by = res.locals.user.id;
        vehicles.update(req.body, req.params.vid, req.params.rid).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //end of endpoint

    router.delete('/realms/:rid/vehicles/:vehicle_id', Authorize.realm(ADMIN), function(req, res) {

        vehicles.delete(req.params.vehicle_id, req.params.rid).then(result => {
            res.json(result);
        }).catch(errorHandler(res));

    }); //end of endpoint


    app.use(ROUTE, router);

}; //end of module.exports
