'use strict';

/**
 * Module dependencies
 */

var when = require('when'),
    callbacks = require('when/callbacks'),
    twitter = require('twitter'),
    db = require('./storage'),
    metrics = require('./metrics');

/**
 * Keyword matching methods
 */

function onlyKeywords(prefix, tracked, list, entity) {
  var name = prefix+entity.text.toLowerCase();
  if(tracked.indexOf(name) > -1) {
    list.push(name);
  }
  return list;
}

function matchedKeywords(tweet, tracked) {
  var keywords = [],
      hashtags = tweet.entities.hashtags,
      keyHashtags = hashtags.reduce(onlyKeywords.bind(null, '#', tracked), []);

  keywords = keywords.concat(keyHashtags);

  return keywords;
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

function persistTweets(trackedKeywords, stream) {
  stream.on('data', function(data) {
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
      var keywords = matchedKeywords(tweet, trackedKeywords);
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

function startTracking(app) {
  var keywords = app.get('keywords');

  when(trackingKeywords(keywords))
    .tap(manageStream)
    .then(persistTweets.bind(null, keywords))
    .catch(console.error);
}

/**
 * Define public API
 */

exports = module.exports = startTracking;
exports.matchedKeywords = matchedKeywords;