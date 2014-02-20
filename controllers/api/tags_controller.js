'use strict';

/**
 * Module dependencies
 */

var util = require('util'),
    when = require('when'),
    nodefn = require('when/node/function'),
    extend = require('node.extend'),
    mysql = require('mysql');

/**
 * Query constants
 */

var COUNT_QUERY = 'select count(tag) as count from tweet_tags where tag in (?)';

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

function geoMergedWithTweetCounts(pool, geoProps) {
  return nodefn.call(pool.getConnection.bind(pool))
    .then(mapPropsToTweetCounts.bind(null, geoProps));
}

function mapPropsToTweetCounts(geoProps, conn) {
  return when.map(geoProps, countKeywordedTweets.bind(null, conn))
          .finally(conn.release.bind(conn));
}

function countKeywordedTweets(conn, prop) {
  var sql = mysql.format(COUNT_QUERY, [prop.keywords]);

  return nodefn.call(conn.query.bind(conn), sql)
          .then(addCounts.bind(null, prop))
}

function addCounts(prop, results) {
  var rows = results[0],
      count = rows[0].count;

  return extend(prop, {count:count});
}

/**
 * Rendering methods
 */

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
  var geoProps = req.app.get('geoProps');

  when(geoMergedWithTweetCounts(req.mysqlPool, geoProps))
    .tap(renderTags.bind(null, res))
    .catch(allErrors.bind(null, res));
}

exports.index = index;