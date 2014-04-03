'use strict';

/**
 * Module dependencies
 */

var util = require('util'),
    moment = require('moment'),
    Errors = require('../errors');

/**
 * Document key-generation utility methods
 */

function dailyKey(date) {
  return util.format('day.%s', date.format('DD'));
}

function hourlyKey(date) {
  return util.format('hour.%s', date.format('HH'));
}

/**
 * Document template methods
 */

function buildTemplate(date) {
  var _id = date.format('YYYYMM'),
      query = { _id:_id },
      update = {
        '$setOnInsert': { metadata:{} }
      };

  return [query, update];
}

/**
 * Document prepatory methods
 */

function prepareMonthlyDocument(date) {
  var doc = buildTemplate(date),
      query = doc[0],
      update = doc[1];

  update['$setOnInsert'].metadata.period = 'monthly';
  update['$setOnInsert'].metadata.date = date.startOf('month').utc().toDate();
  update['$setOnInsert'].metadata.shortDate = date.format('YYYY-MM');

  return [query, update];
}

function prepareDailyDocument(date) {
  var doc = buildTemplate(date),
      query = doc[0],
      update = doc[1];

  query._id += date.format('DD');
  update['$setOnInsert'].metadata.period = 'daily';
  update['$setOnInsert'].metadata.date = date.startOf('day').utc().toDate();
  update['$setOnInsert'].metadata.shortDate = date.format('YYYY-MM-DD');

  return [query, update];
}

/**
 * Document creation methods
 */

function createDocument(period, date) {
  var doc,
      docDate,
      key;

  switch(period) {
    case 'monthly' :
      docDate = moment(date).startOf('month');
      doc = prepareMonthlyDocument(docDate);
      key = dailyKey(date);
      break;

    case 'daily' :
      docDate = moment(date).startOf('day');
      doc = prepareDailyDocument(docDate);
      key = hourlyKey(date);
      break;

    default :
      throw new Errors.UnknownPeriod(period);
  }

  return [doc, key];
}

/**
 * Define Public Api
 */

exports.dailyKey = dailyKey;
exports.hourlyKey = hourlyKey;
exports.create = createDocument;