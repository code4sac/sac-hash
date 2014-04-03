'use strict';

/**
 * Module dependencies
 */

var tracking = require('./metrics/tracking'),
    createScheduler = require('./metrics/scheduler');

/**
 * Export `scheduler()`
 */

exports = module.exports = createScheduler;

/**
 * Define Public Api
 */

exports.track = tracking.track;
exports.preAllocate = tracking.preAllocate;