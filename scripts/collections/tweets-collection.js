define(['backbone','communicator','models/tweet-model'], function( Backbone, Communicator, tweetModel){
  'use strict';

  var tweetCollection = Backbone.Collection.extend({
    model: tweetModel
  });

  var Tweets = new tweetCollection([]);
  
  return Tweets;
})
