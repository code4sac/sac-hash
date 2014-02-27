'use strict';

/**
 * Module dependencies
 */

var extend = require('node.extend'),
    db = require('../../lib/storage');

/**
 * ETL functions
 */

function mergeWithGeoProps(geoProps, keywordCounts) {
  var p, keywords;
  return geoProps.reduce(function(props, prop) {
    p = extend(true, {}, prop);
    p.count = 0;
    keywords = prop.keywords.join('   ');
    keywordCounts.forEach(function(count) {
      if(keywords.match(new RegExp(count._id, 'i'))) {
        p.count = p.count + count.total;
      }
    });
    props.push(p);

    return props;
  }, []);
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