'use strict';
const async = require('async');
const DEBUG = 0,
    UNAUTHORIZED_CODE = 401,
    FORBIDDEN_CODE = 403,
    ERROR_CODE = 412;

module.exports = function(app) {

    const Bookshelf = app.get('bookshelf');
    const _ = require("lodash");
    let Main = require('../service/main')(app);
    let Users = app.locals.model.users;
    let Authorize = {};

    Authorize.privileges = function(key) {

        return function(req, res, next) {

            //Check if user has access to realm

            if (_.includes(res.locals.user._rids_, Number(req.params.rid))) {

                //Privilege key is provided
                if (key) {
                    //Check privileges
                    console.log('Checking privileges');
                    if (res.locals.user._realms_[req.params.rid] == key) return next();
                    else return res.status(FORBIDDEN_CODE).send('Forbidden. No rights.');
                }
                else return next();
            }
            else return res.status(FORBIDDEN_CODE).send('Access denied. Wrong realm.');

        };


    };
    Authorize.camera = function() {

        return function(req, res, next) {
            console.log('Authenticating camera');
            if (!req.params.tag) return res.status(UNAUTHORIZED_CODE).end('Missing parameter <asset_tag>');

            Main.camera_auth(req.params.tag).then(camera => {
                //camera[0].id
                next();
            }).catch(e => {
                return res.status(FORBIDDEN_CODE).end('Invalid <asset_tag>');
            });

        };
    };
    Authorize.account = function(key) {

        return function(req, res, next) {
            console.log('Authorizing account');
            //if (!req.params.user_id) return res.status(UNAUTHORIZED_CODE).end('Missing parameter <user_id>');
            if (key === 'CLIENT') {

                let role = res.locals.user.role;

                if (!req.params.user_id) return res.status(UNAUTHORIZED_CODE).end('Missing parameter <user_id>');

                if (res.locals.user.id == req.params.user_id) return next();

                else if (role === 'DEV' || role === 'SUPER') return next();

                else res.status(FORBIDDEN_CODE).end('Forbidden');
            }

            Users.selectWhere('role', { id: res.locals.user.id }).then(account_role => {

                let user = account_role[0];

                if (key === 'DEV' && user.role === 'DEV') return next();

                else if (key === 'SUPER' && user.role === 'SUPER' || user.role === 'DEV') return next();

                else res.status(FORBIDDEN_CODE).end('Forbidden');

            });

        };
    };

    return Authorize;
};
