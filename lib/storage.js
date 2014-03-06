'use strict';

/**
 * Module dependencies
 */

var util = require('util'),
    db = require('mongodb').MongoClient,
    when = require('when'),
    extend = require('node.extend'),
    nodefn = require('when/node/function'),
    moment = require('moment');

/**
 * MongoDB configuration
 */

var url = process.env.MONGODB_URL + '/' + process.env.MONGODB_DB;

/**
 * MongoDB connection
 */

function connect(mongoUrl) {
  return nodefn.call(db.connect.bind(db), mongoUrl || url);
}

/**
 * Tweet persistence methods
 */

function saveTweet(tweet) {
  return connect().then(function(conn) {
    var tweets = conn.collection('tweets');

    return nodefn.call(
      tweets.update.bind(tweets),
      {id:tweet.id},
      {'$set':tweet},
      {upsert:true, safe:true}
    ).catch(console.error).finally(conn.close.bind(conn));
  });
}

function destroyTweet(status) {
  return connect().then(function(conn) {
    var dfd = when.defer();

    conn.collection(COLLECTION).remove(
      {id:status.id},
      {w:1},
      function(err, count) {
        conn.close();
        if(err) return dfd.reject(err);

        dfd.resolve(status, count);
      }
    )

    // TODO: Deprecate aggregations when deleting?

    return dfd.promise;
  });
}

/**
 * Tweet filtering methods
 */

// Divides a list of keywords into type-based categories
function entities(keywords) {
  return keywords.reduce(
    function (list, keyword) {
      var criteria = new RegExp('^'+keyword.substr(1)+'$', 'i');
      switch(keyword[0]) {
        case '#': list.hashtags.push(criteria); break;
        case '@': list.mentions.push(criteria); break;
      }
      return list;
    },
    { hashtags:[], mentions:[] }
  );
}

function findWithKeywords(conn, keywords, filter) {
  var entitySet = entities(keywords),
      tweets = conn.collection('tweets'),
      query = {
        'entities.hashtags.text': { '$in':entitySet.hashtags }
      };

  query = extend(query, filter);

  return nodefn.call(tweets.find.bind(tweets), query, {});
}

/**
 * Tweet aggregation queries
 */

function countByKeyword(keywords) {
  var entitySet = entities(keywords);

  return connect().then(function(conn) {
    var metrics = conn.collection('metrics.tweets.monthly'),
        timePeriod = moment().utc().subtract('days', 30).toDate();

    return nodefn.call(
      metrics.aggregate.bind(metrics),
      { '$match':{ 'metadata.keyword':{'$ne':null}, 'metadata.date':{'$gt':timePeriod} }},
      { '$group':{ _id:'$metadata.keyword', total:{'$sum':'$total'} }},
      { '$sort':{ _id:1 }}
    ).finally(conn.close.bind(conn));
  });
}

function tweetsPerPeriod(resolution, filter, options) {
  filter = filter || {};
  options = options || {};
  return connect().then(function(conn) {
    var collName = util.format('metrics.tweets.%s', resolution),
        metrics = conn.collection(collName);

    return nodefn.call(metrics.find.bind(metrics), filter, options)
      .then(function(cursor) {
        return nodefn.call(cursor.sort({'metadata.date':1}).toArray.bind(cursor));
      }).finally(conn.close.bind(conn));
  });
}

function allTweets(conn) {
  return connect().then(function(conn) {
    var tweets = conn.collection('tweets');
    return nodefn.call(tweets.find.bind(tweets))
      .then(function(cursor) {
        return nodefn.call(cursor.sort({created_at:1}).toArray.bind(cursor));
      }).finally(conn.close.bind(conn));
  });
}

/**
 * Keyword suggestions queries
 */

function suggestions() {
  return connect().then(function(conn) {
    var suggs = conn.collection('keyword_suggestions');

    return nodefn.call(suggs.find.bind(suggs))
      .then(function(cursor) {
        return nodefn.call(cursor.toArray.bind(cursor));
      }).finally(conn.close.bind(conn));
  });
}

function saveSuggestion(keyword) {
  return connect().then(function(conn) {
    var suggs = conn.collection('keyword_suggestions'),
        suggestion = {
          keyword: keyword,
          created_at: moment().utc().toDate()
        };

    return nodefn.call(suggs.insert.bind(suggs), suggestion, {safe:true})
            .finally(conn.close.bind(conn));
  });
}

/**
 * Define public Api
 */

exports.connect = connect;
exports.saveTweet = saveTweet;
exports.destroyTweet = destroyTweet;
exports.countByKeyword = countByKeyword;
exports.findWithKeywords = findWithKeywords;
exports.tweetsPerPeriod = tweetsPerPeriod;
exports.allTweets = allTweets;
exports.suggestions = suggestions;
exports.saveSuggestion = saveSuggestion;