'use strict';

/**
 * Module dependencies
 */

var db = require('../../lib/storage');

/**
 * ETL functions
 */

function mergeWithGeoProps(geoProps, counts) {
  var propsWithCounts = geoProps.map(function(prop) {
    prop.keywords.forEach(function(keyword) {
      prop.count = counts[keyword.substr(1).toLowerCase()];
    });
    return prop;
  });

  return propsWithCounts;
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
  var geoProps = req.app.get('geoProps'),
      keywords = req.app.get('keywords');

  db.countByKeyword(keywords)
    .then(mergeWithGeoProps.bind(null, geoProps))
    .then(renderTags.bind(null, res))
    .catch(allErrors.bind(null, res));
}

exports.index = index;