'use strict';

/**
 * Module dependencies
 */

var when = require('when'),
    nodefn = require('when/node/function');

/**
 * Query constants
 */

var METRICS_QUERY = 'select count(*) as tweets, concat(date(created_at), \' \', hour(created_at), \':00:00\') as timestamp from tweets where created_at between now() - interval 30 day and now() group by concat(date(created_at), \' \', hour(created_at), \':00:00\') order by created_at';

/**
 * Suggestion retrieval methods
 */

function fetchMetrics(conn) {
  return nodefn.call(conn.query.bind(conn), METRICS_QUERY)
          .finally(conn.release.bind(conn));
}

function renderMetrics(res, results) {
  res.json(results[0]);
}

function allErrors(res, err) {
  res.send(500, {error:err.message});
}

function index(req, res) {
  when(nodefn.call(req.mysqlPool.getConnection.bind(req.mysqlPool)))
    .then(fetchMetrics)
    .then(renderMetrics.bind(null, res))
    .catch(allErrors);
}

exports.index = index;