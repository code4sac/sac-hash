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
    geoProps = require('./lib/geo_properties');

/**
 * Create Express server
 */

var app = express();

/**
 * Build list of keywords to track
 */

var gprops = geoProps(__dirname+'/geo'),
    keywords = gprops.keywords();
/**
 * Express configuration
 */

app.set('env', NODE_ENV);
app.set('port', PORT);
app.set('json spaces',0);
app.set('geoProps', gprops);
app.set('keywords', keywords);
app.use(express.logger('dev'));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
app.use(app.router);
app.use(express.static(__dirname + '/public'));

/**
 * Start collecting tweets from the Stream
 */

require('./lib/tweets')(app);

/**
 * Load public controllers
 */

var tagsController = require('./controllers/api/tags_controller'),
    tweetsController = require('./controllers/api/tweets_controller');

/**
 * Load admin controllers
 */

var admin = {};

admin.suggestionsController = require('./controllers/api/admin/suggestions_controller');
admin.metricsController = require('./controllers/api/admin/metrics_controller');

/**
 * Admin authentication configuration
 */

var protect = express.basicAuth(process.env.ADMIN_USERNAME,process.env.ADMIN_PASSWORD);

/**
 * Public API Routes
 */

app.all('/api/*', function(req, res, next) {
  if(!(/\.(?:geo)*json/.test(req.params[0]) || req.is('json'))) {
    return res.send(406);
  }
  res.type('json');
  next();
});

app.get('/api/tags(.:format)', tagsController.index);
app.get('/api/tweets(.:format)', tweetsController.index);
app.use('/api/geojsons', express.static(__dirname + '/geo'));

/**
 * Admin API Reoutes
 */

app.all('/admin/*', protect);
app.all('/api/admin/*', protect);

app.get('/api/admin/suggestions(.:format)', admin.suggestionsController.index);
app.get('/api/admin/metrics(.:format)', admin.metricsController.index);

/**
 * Start the server
 */

app.listen(app.get('port'), function() {
  console.log('\nExpress server running in %s mode at', app.get('env'));
  console.log(' => http://localhost:%d/', app.get('port'));
  console.log('CTRL + C to shutdown\n');
});