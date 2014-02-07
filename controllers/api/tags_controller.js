'use strict';

/**
 * Module dependencies
 */

var util = require('util'),
    when = require('when'),
    extend = require('node.extend');

/**
 * Query constants
 */

var TAG_QUERY = util.format('select hashtag, NAME2 as name, geometry from %s where hashtag NOT EQUAL TO \'\'', process.env.FUSION_TABLE);
var COUNT_QUERY = 'select count(tag) as count from tweet_tags where tag = \'%s\'';

/**
 * ETL functions
 */

function normalizeRows(data, row) {
  return row.reduce(function(tag) {
    data.columns.forEach(function(name, i) {
      var value = row[i];
      // Merge object literal values as is
      if('object' === typeof value && !util.isArray(value)) {
        extend(tag, value);
      } else {
        tag[name] = row[i];
      }
    });
    return tag;
  }, {});
}

function queryTags(googleApi, client) {
  var deferred = when.defer();

  googleApi.query(TAG_QUERY, client)
    .then(function(data) {
      // Convert array of tags to a more useful obj-literal
      deferred.resolve(data.rows.map(normalizeRows.bind(null, data)));
    }, deferred.reject);

  return deferred.promise;
}

function joinWithTweetCounts(pool, tags) {
  var deferred = when.defer(),
      tagCount = tags.length;

  pool.getConnection(function(err, conn) {
    tags.forEach(function(tag, i) {
      conn.query(util.format(COUNT_QUERY, tag.hashtag), function(err, rows) {
        if(err) {
          return deferred.reject(err);
        }
        tag.count = rows[0].count;
        if(tagCount === i+1) {
          conn.release();
          return deferred.resolve(tags);
        }
      });
    });
  });

  return deferred.promise;
}

function renderTags(res, data) {
  res.json(data);
}

function allErrors(res, err) {
  res.send(500, {error:err.message});
}

/**
 * Controller actions
 */

function index(req, res) {
  var gapi = req.googleApi;

  when(gapi.connected())
    .then(queryTags.bind(null, gapi))
    .then(joinWithTweetCounts.bind(null, req.mysqlPool))
    .tap(renderTags.bind(null, res))
    .catch(allErrors.bind(null, res));
}

exports.index = index;