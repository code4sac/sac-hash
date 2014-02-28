'use strict';

var util = require('util');

function UnknownPeriod(period) {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);
  this.name = 'HTP::MetricError::UnknownPeriod';
  this.message = util.format('The following is an unknown time period value: %s', period);
}
util.inherits(UnknownPeriod, Error);

exports.UnknownPeriod = UnknownPeriod;