'use strict';

/**
 * Module dependencies
 */

var schedule = require('node-schedule'),
    moment = require('moment'),
    when = require('when'),
    tracking = require('./tracking');

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

/**
 * Daily allocation methods
 */

function performDailyAllocation(keywords) {
  var date = moment(date).utc().add('days', 1).startOf('day');

  console.log('preallocate daily metrics for', date.toString());

  when.all(tracking.preAllocate('daily', 'tweets', keywords, date))
    .then(report.bind(null, '=> Daily metric pre-allocation completed (%d inserts, %d updates)'))
    .catch(console.error);
}

function scheduleDailyPreAllocation(keywords) {
  var job = schedule.scheduleJob(
    'metric.daily.preallocation',
    {hour:0},
    performDailyAllocation.bind(null, keywords)
  );

  return job;
}

/**
 * Monthly allocation methods
 */

function performMonthlyAllocation(keywords) {
  var date = moment(date).utc().add('month', 1).startOf('month');

  console.log('=> Pre-allocating monthly metrics for %s', date.toString());

  when.all(tracking.preAllocate('monthly', 'tweets', keywords, date))
    .then(report.bind(null, '=> Monthly metric pre-allocation completed (%d inserts, %d updates)'))
    .catch(console.error);
}

function scheduleMonthlyPreAllocation(keywords) {
  var job = schedule.scheduleJob(
    'metric.monthly.preallocation',
    {date:1},
    performMonthlyAllocation.bind(null, keywords)
  );

  return job;
}

/**
 * Scheduler initialization
 */

function initScheduler(keywords) {
  scheduleDailyPreAllocation(keywords);
  scheduleMonthlyPreAllocation(keywords);
}

/**
 * Define Public Api
 */

module.exports = initScheduler;