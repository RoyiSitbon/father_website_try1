var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs =require('fs');
//var mysql = require('mysql');
var pg = require('pg');
var app = express();
var server = require('http').createServer(app);

var engines = require('consolidate');
//app.engine('jade', engines.jade);
app.engine('html', engines.hogan);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('html', engines.hogan);
app.set('view engine', 'jade');

app.set('port', process.env.PORT || 7777);

// var connection = mysql.createConnection({
//   host     : 'postgresql://ic_ps:Evzao1EC@redshift-ssd.infra-team.com:5439/icbi?tcpKeepAlive=true',
//   user     : 'ic_ps',
//   password : 'Evzao1EC',
//   database : 'icbi'
// });
var conString = "postgresql://ic_ps:Evzao1EC@redshift-ssd.infra-team.com:5439/icbi?tcpKeepAlive=true";
//var conString = "postgres://YourUserName:YourPassword@localhost:5432/YourDatabase";

var client = new pg.Client(conString);
client.connect();


var client = new pg.Client(conString);
client.connect();


//connection.connect();
require('./utils/sqlConnection').setPostgresqlConnection(client); 

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
//var config = require('./config/environment');
var routes = require('./routes/error');

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// dynamically include routes (Controller)
fs.readdirSync(__dirname + '/routes').forEach(function (file) {
  var route = '';
  if (file.substr(-3) === '.js') {
    route = require(__dirname + '/routes/' + file);
    route.rootRoutes(app);
  }
});


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
//}

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


app.listen(7777, function() {
  console.log('Express server listening on port 7777');
});


module.exports = app;
