'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');

/**
 * Synchronous JSON parsing of an entire directory
 */

function readAsJSON(path) {
  return fs.readdirSync(path).map(function(filename) {
    return JSON.parse(fs.readFileSync(path + '/' + filename));
  });
}

module.exports = readAsJSON;