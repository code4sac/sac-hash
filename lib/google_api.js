'use strict';

/**
 * Wraps the Google API in Promises
 */

var when = require('when'),
    googleapis = require('googleapis');

exports.connected = connected;
exports.query = query;

function connected() {
  var deferred = when.defer();

  googleapis
    .discover('fusiontables', 'v1')
    .execute(function(err, client) {
      if(err) {
        return deferred.reject(err);
      }

      deferred.resolve(client, exports);
    });

  return deferred.promise;
}

function query(sql, client) {
  var deferred = when.defer(),
      req = client.fusiontables.query.sql({
        sql : sql
      }).withApiKey(process.env.GOOGLE_API_KEY);

  req.execute(function(err, data) {
    if(err) {
      return deferred.reject(err);
    }

    deferred.resolve(data);
  });

  return deferred.promise;
}
