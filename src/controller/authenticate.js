const ROUTE = '/v1';
const router = require('express').Router();
const _ = require('lodash');
module.exports = function(app) {

    const passport = app.get('passport');
    const errorHandler = require('../helpers/errorhandler');

    //==============================================================================
    router.get('/status', function(req, res, next) {
        return res.json({
            message: 'Logged in',
            user: _.omit(res.locals.user, ['password', '_realms_', '_rids_', 'created_at', 'created_by', 'updated_at', 'updated_by'])
        });
    });
    router.post('/login', function(req, res, next) {

        if (!req.body.password || !req.body.email) {
            return res.json({
                success: false,
                message: 'Kasutajanimi või salasõna puudu' //msg.get('missing_email_password')
            });
        }
        passport.authenticate('local-login', function(err, user, info) {

            if (err) {
                return res.json({
                    success: false,
                    message: err
                });
            }

            if (!user) {
                return res.json({
                    success: false,
                    message: 'No user found.'
                });
            }

            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.json({
                    success: true,
                    message: 'Sisselogimine õnnestus' //msg.get('log_in_success')
                });
            });
        })(req, res, next);
    });

    router.put('/logout', function(req, res) {

        console.log('| User: %s logged out', req.session.passport.user);
        req.logout();

        res.json({
            success: true,
            message: 'Välja logimine õnnestus' //msg.get('log_out_success')
        });

    }); //end of app.get

    app.use(ROUTE, router);
};
