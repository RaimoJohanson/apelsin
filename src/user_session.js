'use strict';

let async = require('async');
const ERR_MESSAGE = 'REALM LOADING FAILED';
// PERMISSION and ROLES middleware
// Define and create main user objects and data containers
module.exports = function(app, req, res, next) {
    let UsersRealms = app.locals.model.users_realms;
    let Realms = app.locals.model.realms;
    /**
     * optimize query
     */
    //_realm_ = { realm_id : ROLE}

    res.locals.user._realms_ = {};
    UsersRealms.select('*', { user_id: res.locals.user.id }).then(results => {

        if (!results) res.json('Error. No realms.');
        res.locals.user._rids_ = [];

        async.each(results, (realm, cb) => {

            res.locals.user._realms_[realm.realm_id] = realm.role;
            res.locals.user._rids_.push(realm.realm_id);
            cb();
        }, () => {

            next();
        });



    }); //UsersRealms
};
