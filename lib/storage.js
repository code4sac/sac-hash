'use strict';

/**
 * Module dependencies
 */

var db = require('mongodb').MongoClient,
    when = require('when'),
    extend = require('node.extend'),
    nodefn = require('when/node/function');

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
    var dfd = when.defer();

    conn.collection('tweets').update(
      {id:tweet.id},
      {'$set':tweet},
      {upsert:true, safe:true},
      function(err, count) {
        conn.close();
        if(err) return dfd.reject(err);

        dfd.resolve(tweet, count);
      }
    );

    return dfd.promise;
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

function keywordCountMap() {
  this.entities.hashtags.forEach(function(hashtag) {
    emit(hashtag.text.toLowerCase(), 1);
  });
}

function keywordCountReduce(id, entities) {
  return entities.reduce(function(count, entity) {
    return count += entity;
  }, 0);
}

function countByKeyword(keywords) {
  var entitySet = entities(keywords);

  return connect().then(function(conn) {
    var tweets = conn.collection('tweets');

    return nodefn.call(
      tweets.mapReduce.bind(tweets),
      keywordCountMap,
      keywordCountReduce,
      {
        out:{ inline:1 },
        query:{ 'entities.hashtags.text': { '$in':entitySet.hashtags } }
      }
    ).then(function(counts) {
      return counts.reduce(function(results, count) {
        results[count._id] = count.value;
        return results;
      }, {});
    }).finally(conn.close.bind(conn));
  });
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

/**
 * Define public Api
 */

exports.connect = connect;
exports.saveTweet = saveTweet;
exports.destroyTweet = destroyTweet;
exports.countByKeyword = countByKeyword;
exports.findWithKeywords = findWithKeywords;
exports.allTweets = allTweets;
exports.suggestions = suggestions;