'use strict';

/**
 * Module dependencies
 */

var nodefn = require('when/node/function'),
    db = require('../../lib/storage');

/**
 * Tweet retrieval methods
 */

function fetchTweets(keywords, filter, res, conn) {
  return db.findWithKeywords(conn, keywords, filter)
    .then(function(tweets) {
      return nodefn.call(
        tweets
          .sort({id:-1})
          .limit(100)
          .toArray.bind(tweets)
      );
    })
    .then(renderTweets.bind(null, res))
    .finally(conn.close.bind(conn));
}

function renderTweets(res, results) {
  res.set('HTP-Tweet-Count', results.length);
  res.json(results);
}

function allErrors(res, err) {
  res.send(500, {error:err.message});
}

/**
 * Controller actions
 */

function index(req, res) {
  var query = req.query,
      keywords = query.keywords,
      filter = {};

  if(query.ntid) {
    filter.id = { '$gt':parseInt(query.ntid,10) };
  }

  db.connect()
    .then(fetchTweets.bind(null, keywords, filter, res))
    .catch(allErrors.bind(null, res));
}

exports.index = index;