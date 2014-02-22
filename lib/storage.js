'use strict';

/**
 * Module dependencies
 */

var db = require('mongodb').MongoClient,
    when = require('when'),
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
 * Define public Api
 */

exports.connect = connect;
exports.saveTweet = saveTweet;
exports.destroyTweet = destroyTweet;
