'use strict';

/**
 * Module dependencies
 */

var when = require('when'),
    callbacks = require('when/callbacks'),
    twitter = require('twitter'),
    db = require('./storage');

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

function manageStream(stream) {
  function destroy(err) {
    if(err) { console.error(err); }
    console.info('Closing stream');
    stream.destroy();
    process.exit();
  }

  stream.once('error', destroy);
  process.on('SIGINT', destroy);
}

function trackingKeywords(keywords) {
  keywords.forEach(function(keyword) {
    console.log('Tracking %s', keyword);
  });

  var tags = keywords.join(',');

  console.log(' ');

  return callbacks.call(twt.stream.bind(twt), 'statuses/filter', {track:tags})
}

/**
 * Tweet persistence
 */

function persistTweets(stream) {
  stream.on('data', function(data) {
    if(data.delete) {
      destroyTweet(data.delete.status);
    } else if(data.created_at) {
      saveTweet(data);
    } else if(data.status_withheld) {
      // No-op
    } else {
      console.log('Skipping unknown Twitter event: %s', JSON.stringify(data));
    }
  });
}

function saveTweet(tweet) {
  db.saveTweet(tweet)
    .then(function() {
      console.log('Saved tweet #%d', tweet.id);
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

function startTracking(app) {
  var keywords = app.get('keywords');

  when(trackingKeywords(keywords))
    .tap(manageStream)
    .then(persistTweets)
    .catch(console.error);
}

/**
 * Define public API
 */

module.exports = startTracking;