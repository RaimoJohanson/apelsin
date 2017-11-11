"use strict";

const bodyParser = require('body-parser');
const _ = require('lodash');
const passport = require('passport');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const url = require('url');
module.exports = function(app) {
  // =============================================================================
  // Database ORM
  // =============================================================================
  app.set('bookshelf', require("./database").bookshelf);

  // =============================================================================
  // MODELS_GENERAL
  // =============================================================================
  require('./model/index')(app);

  var rawBodySaver = function(req, res, buffer, encoding) {
    if (buffer && buffer.length) req.rawBody = buffer.toString(encoding || 'utf8');
  };

  app.use(bodyParser.json({
    limit: "50mb",
    /*'verify': rawBodySaver*/
  }));
  app.use(bodyParser.urlencoded({
    limit: "50mb",
    'verify': rawBodySaver,
    extended: true
  }));
  app.use(bodyParser.raw( /*{ 'verify': rawBodySaver, 'type': '*\/*' }*/ ));


  // =============================================================================
  // AUTHENTICATION & SESSIONS
  // =============================================================================
  app.set('passport', require('./config/passport')(app, passport));
  const store = new KnexSessionStore({
    'knex': app.get('bookshelf').knex,
    'tablename': 'sessions' // optional. Defaults to 'sessions'
  });
  app.use(session({
    'secret': '4vHGLebDtM6za2rjV8VG',
    'saveUninitialized': true,
    'resave': true,
    'cookie': {
      'maxAge': (24 * 60 * 60 * 1000) // 24 hour
      //'maxAge': 10000
    },
    'store': store
  }));
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions

  app.use(function(req, res, next) {

    //Exeptions to endpoints that do not require authentication
    let exeptions = ['/v1/login', '/v1/logout'];
    let requested_url = url.parse(req.url).pathname;
    if (_.includes(exeptions, requested_url)) return next();
    if (requested_url.includes("/v1/recognize")) return next();

    if (!req.isAuthenticated()) {
      return res.render('login.html');
    }


    res.locals.user = req.user.attributes;

    console.log('Request| %s %s (ID: %s) | %s | %s', res.locals.user.first_name, res.locals.user.last_name, res.locals.user.id, req.method, req.originalUrl);

    require('./user_session')(app, req, res, next);

  });

  // =============================================================================
  // CONTROLLERS
  // =============================================================================
  require('./controller/index')(app);
};
