'use strict';

/**
 * Module dependencies
 */

var extend = require('node.extend'),
    moment = require('moment'),
    tmpl = require('./template');

/**
 * Date population methods
 */

function backfillDays(doc) {
  var query = doc[0],
      update = extend({}, doc[1]),
      cursor = moment(update['$setOnInsert'].metadata.date).utc(),
      end = moment(cursor).utc().endOf('month'),
      days = end.diff(cursor, 'days') + 1,
      i = 1,
      key;

  update['$inc'] = {total:0};

  for(i; i <= days; i++) {
    key = tmpl.dailyKey(cursor);
    update['$setOnInsert'][key] = 0;
    cursor.add('days', 1);
  }

  return [query, update];
}

function backfillHours(doc) {
  var query = doc[0],
      update = extend({}, doc[1]),
      cursor = moment(update['$setOnInsert'].metadata.date).utc().startOf('day'),
      end = moment(cursor).utc().endOf('day'),
      hours = end.diff(cursor, 'hours') + 1,
      i = 1,
      key;

  update['$inc'] = {total:0};

  for(i; i <= hours; i++) {
    key = tmpl.hourlyKey(cursor);
    update['$setOnInsert'][key] = 0;
    cursor.add('hours', 1);
  }

  return [query, update];
}

function backfillDates(doc) {
  var period = doc[1]['$setOnInsert'].metadata.period;
  switch(period) {
    case 'daily'   : return backfillHours(doc);
    case 'monthly' : return backfillDays(doc);
    default        : throw new Errors.UnknownPeriod(period);
  }
}

/**
 * Define Public Api
 */

module.exports = backfillDates;