'use strict';

/**
 * Module dependencies
 */

var util = require('util'),
    when = require('when'),
    nodefn = require('when/node/function'),
    googleApi = require('./google_api'),
    twitter = require('twitter'),
    parser = require('./tweet_parser');

/**
 * Query constants
 */

var SET_UTF8MB4 = 'set names utf8mb4; set names utf8mb4 collate utf8mb4_unicode_ci';
var TAG_QUERY = util.format('select hashtag from %s where hashtag not equal to \'\'', process.env.FUSION_TABLE);
var INSERT_TWEET = 'replace into tweets set ?';
var INSERT_TAGS = 'replace into tweet_tags set ?';
var DESTROY_TWEET = 'delete from tweets where tweet_id = ?';
var DESTROY_TAGS = 'delete from tweet_tags where tweet_id = ?';

/**
 * MySQL Interactions
 */

function transaction(queries, conn, cb) {
  var deferred = when.defer();

  when(nodefn.call(conn.beginTransaction.bind(conn)))
    .then(function() {
      when.all(queriesExecute(conn, queries))
      .then(notifyOfSuccess.bind(null, deferred))
      .catch(queryErrors.bind(null, conn, deferred))
      .finally(conn.release.bind(conn));
    });

  return deferred.promise;
}

function queriesExecute(conn, queries) {
  return queries.map(function(args) {
    var query = args[0],
        data = args[1];

    return nodefn.call(conn.query.bind(conn), query, data);
  });
}

function notifyOfSuccess(deferred, results) {
  deferred.resolve(results);
}

function queryErrors(conn, deferred, err) {
  conn.rollback(function() {
    deferred.reject(err);
  });
}

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
 * Twitter API integration
 */

function tracker(deferred, stream) {
  function destroy(err) {
    if(err) { console.error(err); }
    console.info('Closing stream');
    stream.destroy();
    process.exit();
  }

  stream.once('error', destroy);
  process.on('SIGINT', destroy);

  deferred.resolve(stream);

  return deferred.promise;
}

function streamTweets(data) {
  var deferred = when.defer();

  var tags = data.rows.reduce(function(t, row) {
    console.log('Tracking #%s', row[0]);
    t.push('#'+row[0]);
    return t;
  }, []).join(',');

  console.log(' ');

  twt.stream('statuses/filter', {track:tags}, tracker.bind(null, deferred));

  return deferred.promise;
}

function fetchTags(client) {
  return googleApi.query(TAG_QUERY, client);
}

/**
 * Tweet persistence
 */

function persistTweets(mysqlPool, stream) {
  stream.on('data', function(data) {
    var fn;
    try {
      if(data.delete) {
        fn = destroyTweet;
        return;
      } else if(data.created_at) {
        fn = saveTweet;
      } else if(data.status_withheld) {
        return;
      } else {
        console.log('Skipping unknown Twitter event: %s', JSON.stringify(data));
        return;
      }

      mysqlPool.getConnection(fn.bind(null, data));
    } catch(err) {
      console.error('Unknown error persisting tweet: %s', err);
    }
  });
}

function saveTweet(tweet, err, conn) {
  if(err) {
    conn.release();
    console.error('Could not open DB connection: %d', err);
    return;
  }

  var tags = parser.tags(tweet),
      queries = [
        [SET_UTF8MB4],
        [INSERT_TWEET, parser.data(tweet)]
      ];

  if(tags.length > 0) {
    queries.push([INSERT_TAGS, tags]);
  }

  transaction(queries, conn)
    .then(function(results) {
      console.log('Saved tweet #%d', tweet.id);
    }).catch(function(err) {
      console.error('Error saving tweet #%d: %s', tweet.id, err);
      console.error(err);
    });
}

function destroyTweet(tweet, err, conn) {
  if(err) {
    conn.release();
    console.error('Could not open DB connection: %d', err);
    return;
  }

  var queries = [
    [DESTROY_TWEET, tweet.id],
    [DESTROY_TAGS, tweet.id]
  ];

  transaction(queries, conn)
    .then(function(results) {
      console.log('Destroyed tweet #%d', tweet.id);
    }).catch(function(err) {
      console.error('Error destroying tweet #%d: %s', tweet.id, err);
      console.error(err);
    });
}

/**
 * Start tracking Hashtags
 */

function startTracking(app) {
  var mysqlPool = app.get('pool');

  when(googleApi.connected())
    .then(fetchTags)
    .then(streamTweets)
    .then(persistTweets.bind(null, mysqlPool))
    .catch(console.error);
}

/**
 * Define public API
 */

module.exports = startTracking;