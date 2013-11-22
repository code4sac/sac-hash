define(['backbone','communicator','models/tweet-model'], function( Backbone, Communicator, tweetModel){
  'use strict';

  var tweetCollection = Backbone.Collection.extend({
    model: tweetModel,
    initialize: function(){
    	var self = this;
    	
      /* Fetch tweets when tag / map nbhood is clicked
       * ============================================= */
    	Communicator.events.on('clicked', function( hashtag ){
        $('#loader').show();
    		window.setTimeout(function(){
				self.url = 'data/tweets_by_tag.json?hashtag='+hashtag;
				self.reset().fetch({
          success: function() {
            $('#loader').hide();  
          }
        });
			}, 200);
    	});

    }
  });

  var Tweets = new tweetCollection([]);
  
  return Tweets;
})
