'use strict';

/**
 * Environment configuration
 */

require('dotenv').load();

/**
 * Module dependencies
 */

var when = require('when');
var callbacks = require('when/callbacks');
var twitter = require('twitter');
var db = require('./lib/storage');
var metrics = require('./lib/metrics');
var geoProps = require('./lib/geo_properties');
var extractKeywords = require('./lib/utils/keyword_extractor');

/**
 * Build list of keywords to track
 */

var gprops = geoProps('./geo');
var keywords = gprops.keywords();

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

function manageStream(twitter) {
  var socket = twitter.socket;
  var stream = twitter.stream;

  function destroy() {
    console.info('Closing Twitter connection...');
    socket.close();
    console.info('Exiting process due to closed Twitter connection');
    process.exit();
  }

  socket.on('open', function() {
    console.info('Connected to Twitter');
  });

  socket.on('error', function(_, error) {
    console.error('sac-hash::socket-error', error);
  });

  socket.on('reopen', function(socket, strategy, error) {
    if(error) {
      console.log('Reconnecting: %s', error.message);
    } else {
      console.log('Reconnecting...');
    }
  });

  socket.on('backoff', function(socket, number, delay) {
    console.log('Retrying in', delay, 'ms');
  });

  stream.on('error', function(error) {
    console.error('sac-hash::stream-error', error);
  });

  socket.once('close', destroy);
  process.on('SIGINT', destroy);
}

function trackingKeywords(keywords) {
  keywords.forEach(function(keyword) {
    console.log('Tracking %s', keyword);
  });

  var tags = keywords.join(',');

  console.log(' ');

  return callbacks.call(twt.stream.bind(twt), 'statuses/filter', {track:tags});
}

/**
 * Tweet persistence
 */

function persistTweets(trackedKeywords, twitter) {
  twitter.stream.on('data', function(data) {
    if(data.delete) {
      destroyTweet(data.delete.status);
    } else if(data.created_at) {
      saveTweet(data, trackedKeywords);
    } else if(data.status_withheld) {
      // No-op
    } else {
      console.log('Skipping unknown Twitter event: %s', JSON.stringify(data));
    }
  });
}

function saveTweet(tweet, trackedKeywords) {
  db.saveTweet(tweet)
    .then(function() {
      console.log('Saved tweet #%d', tweet.id);
    }).tap(function() {
      var keywords = extractKeywords(tweet, trackedKeywords);
      metrics.track('tweets', 1, keywords, tweet.created_at);
    }).catch(function(err) {
      console.error('Error saving tweet #%d: %s', tweet.id, err);
      console.error(err);
    });
}

function destroyTweet(status) {
  db.destroyTweet(status)
    .then(function() {
      console.log('Destroyed tweet #%d', status.id);
    }).catch(function(err) {
      console.error('Error destroying tweet #%d: %s', status.id, err);
      console.error(err);
    });
}

/**
 * Start tracking Hashtags
 */

function startTracking() {
  return when(trackingKeywords(keywords))
    .tap(manageStream)
    .then(persistTweets.bind(null, keywords))
    // auto-restart. TODO: exit process on signal
    .catch(function(err) {
      console.error(err);
      console.error('EXITING');
      process.exit();
    });
}

startTracking();
