'use strict';

/**
 * Environment configuration
 */

require('dotenv').load();

/**
 * Module dependencies
 */

var readline = require('readline'),
    util = require('util'),
    when = require('when'),
    db = require('../lib/storage'),
    sequence = require('when/sequence'),
    metrics = require('../lib/metrics'),
    geoProps = require('../lib/geo_properties'),
    keywords = require('../lib/tweets').matchedKeywords;

/**
 * Create command-prompt interface
 */

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Get list of tracked keywords
 */

var gprops = geoProps(__dirname+'/../geo'),
    tracking = gprops.keywords();

/**
 * Sequential operation methods
 */

function preallocate(period, tweet) {
  return function() {
    rl.write(util.format('Pre-allocating %s metrics for %s\n', period, tweet.created_at));
    return metrics.preAllocate(period, 'tweets', tracking, tweet.created_at);
  }
}

function track(tweet, kws) {
  return function() {
    rl.write(util.format('Tracking tweet #%s created on %s\n', tweet.id, tweet.created_at));
    return metrics.track('tweets', 1, kws, tweet.created_at);
  }
}

/**
 * Start the fun
 */

rl.write('You are about to rebuild the tracked tweet metrics.\n');
rl.write('\n');
rl.write('This command will:\n');
rl.write('\n');
rl.write('*  Parse *every* stored tweet\n')
rl.write('*  Pre-allocate a metric document for each month and day for *every*\n');
rl.write('   tracked hashtag for *each* tweet\n');
rl.write('*  Increment the counts for each tracked tweet in all matching documents\n');
rl.write('\n');
rl.write('It is recommended that you manually purge all metrics documents\n');
rl.write('prior to running this command.\n');
rl.write('\n');
rl.question('Are you sure you want to rebuild metrics? (y/n) ', function(answer) {
  if(!answer.match(/^y(es)?$/i)) {
    rl.write('Aborted.\n');
    rl.close();
    return process.exit();
  }

  rl.write('\n');
  rl.write('Fetching *all* tweets... ');

  db.allTweets()
    .then(function(tweets) {
      var ops, kws;

      rl.write(util.format('found %d\n', tweets.length));

      ops = tweets.reduce(function(_ops, tweet) {
        kws = keywords(tweet, tracking);

        if(kws.length === 0) return _ops;

        // Preallocation is un-optimized meaning it will attempt to preallocate
        // for *every* tweet, regardless of if the document already exists.
        _ops.push(preallocate('monthly', tweet))
        _ops.push(preallocate('daily', tweet));
        _ops.push(track(tweet, kws));

        return _ops;
      }, []);

      // To prevent connection pool exhaustion, run all operations sequentially
      return sequence(ops);
    }).catch(function(err) {
      console.error(err.message, err.stack)
    }).finally(function() {
      rl.write('\n');
      rl.write('Done.\n');
      rl.close();
      process.exit();
    });
});