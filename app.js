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

var express = require('express');

/**
 * Create Express server
 */

var app = express();

/**
 * Express configuration
 */

app.set('env', NODE_ENV);
app.set('port', PORT);
app.use(express.logger('dev'));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
app.use(express.static(__dirname + '/public'));

/**
 * Start the server
 */

app.listen(app.get('port'), function() {
  console.log('\nExpress server running in %s mode at', app.get('env'));
  console.log(' => http://localhost:%d/', app.get('port'));
  console.log('CTRL + C to shutdown\n');
});