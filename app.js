'use strict';

/**
 * Environment configuration
 */

require('dotenv').load();

var NODE_ENV = process.env.NODE_ENV || 'development',
    PORT = process.env.PORT || 8000;

/**
 * Module dependencies
 */

var express = require('express'),
    when = require('when'),
    mysql = require('mysql'),
    googleApi = require('./lib/google_api');

/**
 * MySQL pool configuration
 */

var pool = mysql.createPool({
      host     : process.env.MYSQL_HOST,
      user     : process.env.MYSQL_USER,
      password : process.env.MYSQL_PASSWORD,
      database : process.env.MYSQL_DATABASE,
      multipleStatements : true
    });

/**
 * Start collecting tweets from the Stream
 */

require('./lib/tweets')(pool);

/**
 * Create Express server
 */

var app = express();

/**
 * Load controllers
 */

var tagsController = require('./controllers/api/tags_controller');

/**
 * Express configuration
 */

app.set('env', NODE_ENV);
app.set('port', PORT);
app.set('json spaces',0);
app.use(express.logger('dev'));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
app.use(app.router);
app.use(express.static(__dirname + '/public'));

/**
 * API Routes
 */

app.all('/api/*', function(req, res, next) {
  if(!(/\.json/.test(req.params[0]) || req.is('json'))) {
    return res.send(406);
  }
  req.googleApi = googleApi;
  req.mysqlPool = pool;
  next();
});
app.get('/api/tags(.:format)', tagsController.index);

/**
 * Start the server
 */

app.listen(app.get('port'), function() {
  console.log('\nExpress server running in %s mode at', app.get('env'));
  console.log(' => http://localhost:%d/', app.get('port'));
  console.log('CTRL + C to shutdown\n');
});