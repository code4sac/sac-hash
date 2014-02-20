var srlzr = null,
    serialize = (srlzr = require('php-srlzr')).serialize.bind(srlzr);

function tweetData(tweet) {
  var tweetData = {
    tweet_id: tweet.id,
    tweet_text: tweet.text,
    created_at: new Date(tweet.created_at),
    user_id: tweet.user.id,
    screen_name: tweet.user.screen_name,
    name: tweet.user.name,
    entities: new Buffer(serialize(tweet.entities)).toString('base64'),
    profile_image_url: tweet.user.profile_image_url
  };

  if(tweet.geo) {
    tweetData.geo_lat = tweet.geo.coordinates[0],
    tweetData.geo_long = tweet.geo.coordinates[1];
  }

  return tweetData;
}

function tweetTags(tweet) {
  return tweet.entities.hashtags.map(function(tag){
    return {
      tweet_id: tweet.id,
      tag: '#'+tag.text.toLowerCase()
    }
  });
}

exports.data = exports.tweetData = tweetData;
exports.tags = exports.tweetTags = tweetTags;