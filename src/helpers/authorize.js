'use strict';
const async = require('async');
const DEBUG = 0,
    UNAUTHORIZED_CODE = 401,
    FORBIDDEN_CODE = 403,
    ERROR_CODE = 412,
    NOT_FOUND_CODE = 404;

module.exports = function(app) {

    var _ = require("lodash");
    let Cameras = app.locals.model.cameras;
    let Users = app.locals.model.users;
    let Authorize = {};

    Authorize.realm = function(key) {

        return function(req, res, next) {

            //Check if user has access to realm
            if (_.includes(res.locals.user._rids_, Number(req.params.rid))) {

                //Privilege key is provided
                if (key) {
                    //Check privileges
                    console.log('Checking privileges');
                    if (res.locals.user._realms_[req.params.rid] == key) return next();
                    else return res.status(FORBIDDEN_CODE).send('Forbidden');
                }
                else return next();
            }
            else return res.status(FORBIDDEN_CODE).send('Access denied');

        };


    };
    Authorize.camera = function() {

        return function(req, res, next) {
            console.log('Authenticating camera');
            if (!req.params.tag) return res.status(UNAUTHORIZED_CODE).end('Missing parameter <asset_tag>');

            Cameras.select('*', { asset_tag: req.params.tag }).then(result => {
                if (!result[0]) return res.status(NOT_FOUND_CODE).end('Camera not found');
                else next();
            }).catch(e => {
                return res.status(FORBIDDEN_CODE).end('Invalid <asset_tag>');
            });


        };
    };
    Authorize.account = function(key) {

        return function(req, res, next) {
            const GODS = ['DEV', 'SUPER'];

            console.log('Authorizing account');
            //if (!req.params.user_id) return res.status(UNAUTHORIZED_CODE).end('Missing parameter <user_id>');
            if (key === 'SELF') {

                let role = res.locals.user.role;

                if (!req.params.user_id) return res.status(UNAUTHORIZED_CODE).end('Missing parameter <user_id>');

                if (res.locals.user.id == req.params.user_id) return next();

                else if (GODS.includes(role)) return next();

                else res.status(FORBIDDEN_CODE).end('Forbidden');
            }

            Users.select('role', { id: res.locals.user.id }).then(account_role => {

                let user = account_role[0];

                if (GODS.includes(key) && GODS.includes(user.role)) return next();

                else if (key === user.role || GODS.includes(user.role)) return next();

                return res.status(FORBIDDEN_CODE).end('Forbidden');

            });

        };
    };

    return Authorize;
};
