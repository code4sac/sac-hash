'use strict';

/**
 * Module dependencies
 */

var tracking = require('./metrics/tracking');

/**
 * Define Public Api
 */

exports.track = tracking.track;
exports.preAllocate = tracking.preAllocate;