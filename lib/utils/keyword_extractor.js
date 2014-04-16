'use strict';

function onlyKeywords(prefix, tracked, list, entity) {
  var name = prefix+entity.text.toLowerCase();
  if(tracked.indexOf(name) > -1) {
    list.push(name);
  }
  return list;
}

function keywordExtractor(tweet, tracked) {
  var keywords = [];
  var hashtags = tweet.entities.hashtags;
  var keyHashtags = hashtags.reduce(onlyKeywords.bind(null, '#', tracked), []);

  keywords = keywords.concat(keyHashtags);

  return keywords;
}

module.exports = keywordExtractor;