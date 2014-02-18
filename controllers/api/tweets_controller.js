'use strict';

/**
 * Module dependencies
 */

var when = require('when'),
    nodefn = require('when/node/function'),
    mysql = require('mysql');

/**
 * Query constants
 */

var TWEETS_QUERY_PREFIX = 'select * from tweets left join tweet_tags on tweet_tags.tweet_id = tweets.tweet_id';
var TWEETS_QUERY_FILTER = 'where ?';
var TWEETS_QUERY_NEWEST = 'and tweets.created_at >= ?';
var TWEETS_QUERY_OLDEST = 'and DATE(tweets.created_at) <= ?';
var TWEETS_QUERY_LATEST = 'and tweets.tweet_id > ?';
var TWEETS_QUERY_CONSTRAINTS = 'order by tweets.tweet_id DESC limit 100';

/**
 * Tweet retrieval methods
 */

function buildQuery(params) {
  var query = [TWEETS_QUERY_PREFIX,TWEETS_QUERY_FILTER],
      inserts = [{tag:params.tag}];

  if(params.ntd) {
    query.push(TWEETS_QUERY_NEWEST);
    inserts.push(params.ntd);
  }

  if(params.otd) {
    query.push(TWEETS_QUERY_OLDEST);
    inserts.push(params.otd);
  }

  if(params.ntid) {
    query.push(TWEETS_QUERY_LATEST);
    inserts.push(parseInt(params.ntid, 10));
  }

  return mysql.format(query.join(' '), inserts);
}

function fetchTweets(query, conn) {
  return nodefn.call(conn.query.bind(conn), query)
          .finally(conn.release.bind(conn));
}

function renderTweets(res, results) {
  res.json(results[0]);
}

function allErrors(res, err) {
  res.send(500, {error:err.message});
}

/**
 * Controller actions
 */

function index(req, res) {
  var query = buildQuery(req.query);

  when(nodefn.call(req.mysqlPool.getConnection.bind(req.mysqlPool)))
    .then(fetchTweets.bind(null, query))
    .then(renderTweets.bind(null, res))
    .catch(allErrors.bind(null, res));
}

exports.index = index;