'use strict';

/**
 * Module dependencies
 */

var db = require('../../lib/storage');

/**
 * Rendering methods
 */

function renderNewSuggestion(res, data) {
  res.json(data[0]);
}

function allErrors(res, err) {
  res.send(500, {error:err.message});
}

/**
 * Controller actions
 */

function create(req, res) {
  var keyword = req.body.keyword;

  db.saveSuggestion(keyword)
    .then(renderNewSuggestion.bind(null, res))
    .catch(allErrors.bind(null, res));
}

exports.create = create;