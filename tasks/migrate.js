'use strict';

/**
 * Environment configuration
 */

require('dotenv').load();

var util = require('util'),
    when = require('when'),
    sequence = require('when/sequence'),
    delay = require('when/delay'),
    db = require('./lib/storage'),
    mysql = require('mysql'),
    twitter = require('twitter');

/**
 * Twitter Client configuration
 */

var twt = new twitter({
  consumer_key : process.env.TWITTER_CONSUMER_KEY,
  consumer_secret : process.env.TWITTER_CONSUMER_SECRET,
  access_token_key : process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret : process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/**
 * Twitter Rate Limiting
 */

var REQS_PER_MIN = 180,
    RATE_LIMIT_WINDOW = 15 * 60 * 100, // 15 minutes in ms
    RATE_LIMIT = {
      limit : REQS_PER_MIN,
      remaining : REQS_PER_MIN,
      reset : (+new Date) + RATE_LIMIT_WINDOW,
      delay : 0,
      update : function(headers) {
        this.limit = parseInt(headers['x-rate-limit-limit'], 10);
        this.remaining = parseInt(headers['x-rate-limit-remaining'], 10);
        this.reset = parseInt(headers['x-rate-limit-reset'], 10) * 1000;

        if(this.remaining < 1) {
          this.delay = this.reset - (+new Date);
        } else {
          this.delay = 0;
        }
      }
    };

/**
 * MySQL Configuration
 */

var sqlConn = mysql.createConnection({
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE
  });

/**
 * MySQL migration query
 */

var start_id = parseInt((process.env.START_ID||0), 10),
    TWEET_QUERY = mysql.format(
      'select tweet_id from tweets where tweet_id > ? order by tweet_id ASC',
      [start_id]
    );

/**
 * Connect to MySQL
 */

sqlConn.connect();

/**
 * Generation migrations
 */

var migration = when.defer(),
    operations = [];

sqlConn.query(TWEET_QUERY, function(err, rows) {
  if(err) return migration.reject(err);

  operations = rows.map(function(row) {
    return function() {
      var dfd = when.defer();

      if(RATE_LIMIT.delay > 0) {
        console.log('Rate limited, waiting for reset in %dms', RATE_LIMIT.delay);
        var progress;
        progress = setInterval(function() {
          if(this.delay === 0) {
            clearInterval(progress);
            console.log('');
          } else {
            process.stdout.write('.');
          }
        },10000);
      }
      return delay(RATE_LIMIT.delay).then(function() {
        twt.get('/statuses/show/'+row.tweet_id+'.json', function(tweet, headers) {
          RATE_LIMIT.update(headers);

          migration.notify(util.format('Migrating Tweet #%d', row.tweet_id));
          if(tweet.id) {
            migration.notify(util.format('=> Saving Tweet #%d', tweet.id));

            db.saveTweet(tweet).then(dfd.resolve, dfd.reject)
              .then(function() {
                migration.notify(util.format('=> Saved Tweet #%d', tweet.id));
              });
          } else {
            var errorData = JSON.parse(tweet.data);
            var errors = errorData.errors.map(function(err) {
              return util.format('%s (%d)', err.message, err.code);
            }).join(', ');
            var error = util.format('%s: %s', tweet.statusCode, errors);

            migration.notify(util.format('=> Skipping #%d due to Twitter API errors: %s', row.tweet_id, error));
            dfd.resolve();
          }
        });

        return dfd.promise;
      });
    }
  });

  sequence(operations)
    .then(migration.resolve)
    .catch(console.error)
});

/**
 * Monitor migration process and clean up
 */

migration.promise
  .then(null, null, console.log)
  .catch(console.error)
  .finally(function() {
    console.log('exiting');
    process.exit();
  });

/**
 * Twitter library monkey patch
 * This adds the response headers to the callback execution so that
 * the migration script can monitor the Api Rate Limiting
 */

var http = require('http'),
    querystring = require('querystring');

twt.get = function(url, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  if ( typeof callback !== 'function' ) {
    throw "FAIL: INVALID CALLBACK.";
    return this;
  }

  if (url.charAt(0) == '/')
    url = this.options.rest_base + url;

  this.oauth.get(url + '?' + querystring.stringify(params),
    this.options.access_token_key,
    this.options.access_token_secret,
  function(error, data, response) {
    if (error) {
      var err = new Error('HTTP Error '
        + error.statusCode + ': '
        + http.STATUS_CODES[error.statusCode]);
      err.statusCode = error.statusCode;
      err.data = error.data;
      callback(err, response.headers);
    } else {
      try {
        var json = JSON.parse(data);
        callback(json, response.headers);
      } catch(err) {
        callback(err, response.headers);
      }
    }
  });
  return this;
}