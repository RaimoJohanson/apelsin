'use strict';

module.exports = function(app, req, res, next) {
    let UsersRealms = app.locals.model.users_realms;
    let Realms = app.locals.model.realms;
    /**
     * optimize query
     */
    //If authenticated declare user as admin
    res.locals.user.realms = [];

    UsersRealms.SelectWhere('*', { user_id: res.locals.user.id }).then(results => {

        if (!results) res.json('Error. No realms.');

        res.locals.user.realms = results;

        next();

    }); //UsersRealms
};
