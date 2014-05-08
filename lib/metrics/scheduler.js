'use strict';

/**
 * Module dependencies
 */

var later = require('later'),
    moment = require('moment'),
    when = require('when'),
    tracking = require('./tracking');

/**
 * Configure Later library
 */

later.date.UTC();

/**
 * Scheduling utility methods
 */

function report(str, results) {
  var ops = results.reduce(function(o, r) {
    if(r[1].n === 0) return;
    if(r[1].updatedExisting) {
      o.updates = o.updates + 1;
    } else {
      o.inserts = o.inserts + 1;
    }
    return o;
  }, {updates:0, inserts:0});
  console.log(str, ops.inserts, ops.updates);
}

function schedule(schedText, task) {
  var sched = later.parse.text(schedText);

  later.setInterval(task, sched);
}

/**
 * Daily allocation methods
 */

function allocateDaily(keywords) {
  var date = moment(date).utc().add('days', 1).startOf('day');

  console.log('=> Pre-allocating daly metrics for %s', date.toString());

  when.all(tracking.preAllocate('daily', 'tweets', keywords, date))
    .then(report.bind(null, '=> Daily metric pre-allocation completed (%d inserts, %d updates)'))
    .catch(console.error);
}

/**
 * Monthly allocation methods
 */

function allocateMonthly(keywords) {
  var date = moment(date).utc().add('month', 1).startOf('month');

  console.log('=> Pre-allocating monthly metrics for %s', date.toString());

  when.all(tracking.preAllocate('monthly', 'tweets', keywords, date))
    .then(report.bind(null, '=> Monthly metric pre-allocation completed (%d inserts, %d updates)'))
    .catch(console.error);
}

/**
 * Scheduler initialization
 */

function initScheduler(keywords) {
  schedule('on the first day of the month at 0:00:00am', allocateMonthly.bind(null, keywords));
  schedule('at 0:00:00am every day', allocateDaily.bind(null, keywords));
}

/**
 * Define Public Api
 */

module.exports = initScheduler;