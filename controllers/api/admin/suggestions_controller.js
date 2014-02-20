'use strict';

/**
 * Module dependencies
 */

var when = require('when'),
    nodefn = require('when/node/function');

/**
 * Query constants
 */

var SUGGESTIONS_QUERY = 'select * from hashtag_suggestions';

/**
 * Suggestion retrieval methods
 */

function fetchSuggestions(conn) {
  return nodefn.call(conn.query.bind(conn), SUGGESTIONS_QUERY)
          .finally(conn.release.bind(conn));
}

function renderSuggestions(res, results) {
  res.json(results[0]);
}

function allErrors(res, err) {
  res.send(500, {error:err.message});
}

/**
 * Controller actions
 */

function index(req, res) {
  when(nodefn.call(req.mysqlPool.getConnection.bind(req.mysqlPool)))
    .then(fetchSuggestions)
    .then(renderSuggestions.bind(null, res))
    .catch(allErrors);
}

exports.index = index;