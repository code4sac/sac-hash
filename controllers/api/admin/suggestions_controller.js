'use strict';

/**
 * Module dependencies
 */

var db = require('../../../lib/storage');

/**
 * Rendering methods
 */

function renderSuggestions(res, results) {
  res.json(results);
}

function allErrors(res, err) {
  res.send(500, {error:err.message});
}

/**
 * Controller actions
 */

function index(req, res) {
  db.suggestions()
    .then(renderSuggestions.bind(null, res))
    .catch(allErrors.bind(null, res));
}

exports.index = index;