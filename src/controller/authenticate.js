const ROUTE = '/v1';
const router = require('express').Router();

module.exports = function(app) {


    // const msg = require('../config/messages')(app);
    const passport = app.get('passport');

    function errorHandler(res) {
        var msg = {
            success: false
        };
        return function(err) {

            if (err.status_code) return res.status(err.status_code).json(err.message);
            app.locals.logger.error(err);

            msg.message = err;
            res.status(412).json(msg);
        };
    }

    //==============================================================================
    router.post('/login', function(req, res, next) {

        if (!req.body.password || !req.body.email) {
            return res.json({
                success: false,
                message: 'Kasutajanimi või salasõna puudu' //msg.get('missing_email_password')
            });
        }
        passport.authenticate('local-login', function(err, user, info) {

            if (err) {
                console.log('authenticate.js -> passport.authenticate error');
                console.log(err);
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

    //==============================================================================
    router.put('/logout', function(req, res) {

        console.log('| User: %s logged out', req.session.passport.user);
        req.logout();

        res.json({
            success: true,
            message: 'Välja logimine õnnestus' //msg.get('log_out_success')
        });

    }); //end of app.get
    //==============================================================================


    app.use(ROUTE, router);
};
