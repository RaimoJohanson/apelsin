var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
//process.env.salt = 'ahoy'; //tee selgeks endale https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html
//https://www.bigcommerce.com/blog/pci-compliance/
//ISKE 

const nunjucks = require('nunjucks');

nunjucks.configure('./src/views', {
  autoescape: true,
  express: app
});

app.engine('html', nunjucks.render);
app.set('view engine', 'html');

app.use(express.static('client'));
app.use('/', express.static('fe'));

// load application
require('./src/app')(app);

// start server
server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
