var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

require('dotenv').load();

const nunjucks = require('nunjucks');

nunjucks.configure('./src/views', {
  autoescape: true,
  express: app
});

app.engine('html', nunjucks.render);
app.set('view engine', 'html');

app.use(express.static('client'));
app.use(express.static('fe'));

// load application
require('./src/app')(app);

app.use('/', express.static('fe'));


// start server
server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
