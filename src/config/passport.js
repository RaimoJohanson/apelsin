const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const moment = require('moment');
const salt = process.env.SALT;
const USERNAME_FIELD = 'email';
const PASSWORD_FIELD = 'password'

// expose this function to our app using module.exports
module.exports = function(app, passport) {

    //const msg = require('./messages')(app);

    var User = app.locals.model.users;

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================

    // used to serialize the user for the session
    passport.serializeUser((user, done) => done(null, user.id));

    // used to deserialize the user
    passport.deserializeUser((id, done) => {

        new User({ 'id': id })
            .fetch()
            .then(user => {
                if (!user) return done('DESERIALIZE_NOUSER');
                done(null, user);

            }).catch(err => done('DESERIALIZE_FETCHUSER'));
    });

    let conf = {
        usernameField: USERNAME_FIELD,
        passwordField: PASSWORD_FIELD,
        passReqToCallback: true // allows us to pass back the entire request to the callback
    };

    passport.use('local-login', new LocalStrategy(conf, (req, email, password, done) => {

        new User({ 'email': email })
            .fetch()
            .then(user => {
                if (!user) return done('LOGIN_EMAIL');

                // crypt

                let decipher = crypto.createDecipher('aes256', salt);
                let pw = decipher.update(user.get('password'), 'base64', 'utf8');
                pw += decipher.final('utf8');

                // match
                if (pw === password) return done(null, user);
                else return done('LOGIN_PASSWORD');

            }).catch(err => {
                console.log(err);
                done('LOGIN_FETCHUSER');
            });

    }));

    return passport;
};
