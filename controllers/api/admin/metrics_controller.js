'use strict';

/**
 * Module dependencies
 */

var when = require('when'),
    moment = require('moment'),
    nodefn = require('when/node/function'),
    db = require('../../../lib/storage');

/**
 * Rendering methods
 */

function renderMetrics(res, results) {
  res.json(results);
}

function allErrors(res, err) {
  res.send(500, {error:err.message});
}

function index(req, res) {
  var aMonthAgo = moment().utc().subtract('days', 30).toDate(),
      filter = { 'metadata.date':{'$gt':aMonthAgo}, 'metadata.keyword':null };

  when.map(db.tweetsPerPeriod('daily', filter))
    .then(renderMetrics.bind(null, res))
    .catch(allErrors.bind(null, res));
}

exports.index = index;