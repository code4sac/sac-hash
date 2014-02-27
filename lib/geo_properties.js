'use strict';

/**
 * Module dependencies
 */

var when = require('when'),
    nodefn = require('when/node/function'),
    readAsJSON = require('./json/read');

/**
 * Property list enhancement methods
 */

function keywords(propList) {
  return propList.reduce(function(list, prop) {
    return list.concat((prop.keywords||[]).map(function(keyword) {
      return keyword.toLowerCase();
    }));
  }, []);
}

/**
 * Synchronous GeoJSON Property extraction
 */

function buildPropertiesList(path) {
  var propList = readAsJSON(path).reduce(extractProperties, []);
  propList.keywords = keywords.bind(null, propList);
  return propList;
};

function extractProperties(list, geojson) {
  var props;
  if(props = geojson.properties) {
    list = list.concat(props);
  }
  return list;
}

module.exports = buildPropertiesList;