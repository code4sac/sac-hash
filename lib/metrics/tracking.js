'use strict';

/**
 * Module dependencies
 */

var util = require('util'),
    when = require('when'),
    nodefn = require('when/node/function'),
    extend = require('node.extend'),
    moment = require('moment'),
    db = require('../storage'),
    tmpl = require('./template'),
    backfillDates = require('./backfill');

/**
 * Document insertion methods
 */

function addDocument(collection, query, update) {
  return nodefn.call(
      collection.update.bind(collection),
      query,
      update,
      { upsert:true, safe:true }
    );
}

function addDocuments(metrics, query, update, keywords) {
  var ops = [];
  ops.push(addDocument(metrics, query, update));

  if(keywords) {
    ops = ops.concat(keywords.map(function(keyword) {
      var _query = extend(true, {}, query),
          _update = extend(true, {}, update);

      keyword = keyword.toLowerCase();
      _query._id += '/' + keyword;
      _update['$setOnInsert'].metadata.keyword = keyword;

      return addDocument(metrics, _query, _update);
    }));
  }

  return ops;
}

/**
 * Pre-allocation methods
 */

function preAllocate(period, name, keywords, _date) {
  var date = _date ? moment(_date).utc() : moment().utc().startOf('day'),
      $ = tmpl.create(period, date),
      doc = backfillDates($[0]),
      query = doc[0],
      update = doc[1];

  return db.connect().then(function(conn) {
    var metrics = conn.collection(util.format('metrics.%s.%s', name, period));

    return when.all(addDocuments(metrics, query, update, keywords)).finally(conn.close.bind(conn));
  });
}

/**
 * Tracking methods
 */

function track(name, count, keywords, timestamp) {
  var date = moment(timestamp).utc();
  return db.connect()
    .then(function(conn) {
      return when.all(
        __increment__(conn, 'monthly', name, count, date, keywords),
        __increment__(conn, 'daily', name, count, date, keywords)
      ).finally(conn.close.bind(conn));
    });
}

function __increment__(conn, period, name, count, date, keywords) {
  var metrics = conn.collection(util.format('metrics.%s.%s', name, period)),
      $ = tmpl.create(period, date),
      doc = $[0],
      query = doc[0],
      update = doc[1],
      key = $[1];

  update['$inc'] = update['$inc'] || {};
  update['$inc'][key] = count;
  update['$inc'].total = count;

  return addDocuments(metrics, query, update, keywords);
}

/**
 * Define Public Api
 */

exports.track = track;
exports.preAllocate = preAllocate;