define(['backbone','communicator','models/tweet-model'], function( Backbone, Communicator, tweetModel){
  'use strict';

  var tweetCollection = Backbone.Collection.extend({
    model: tweetModel,
    initialize: function(){
    	var self = this;
    	Communicator.events.on('clicked', function( hashtag ){
    		window.setTimeout(function(){
				self.url = 'data/tweets_by_tag.json';
				self.reset().fetch();
			}, 200);
    	});
    }
  });

  var Tweets = new tweetCollection([]);
  
  return Tweets;
})
