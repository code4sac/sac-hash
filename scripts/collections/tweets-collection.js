define(['backbone','communicator','models/tweet-model'], function( Backbone, Communicator, tweetModel){
  'use strict';

  var tweetCollection = Backbone.Collection.extend({
    model: tweetModel,
    initialize: function(){
      	var self = this;
      	
        /* Fetch tweets when tag / map nbhood is clicked
         * ============================================= */
      	Communicator.events.on('clicked', function( hashtag ){
          self.loadTweets( hashtag );
      	});

        // this.autoLoader();
    },
    parse: function(response){
        var newTweets = response.length,
            currentTweets = this.models.length,
            diff;

            console.log('new:' + newTweets, 'old:' + currentTweets);

        if ( currentTweets > 0 && newTweets > currentTweets ){
            diff = newTweets - currentTweets;
            response = response.slice( diff );
        }

        return response;
    },
    loadTweets: function( hashtag ){
        var self = this;
            
        window.setTimeout(function(){
          self.url = 'data/tweets_by_tag.json?hashtag='+hashtag;
          self.reset().fetch({
            success: function() {
              self.addNew = false;
            }
          });
        }, 400);
    },
    autoLoader: function(){
        var self = this;
      
        window.setInterval(function(){
          self.fetch({
            remove: false,
            success: function(data){
              self.addNew = true;
            }
          })
        }, 5000);
    }
  });

  var Tweets = new tweetCollection([]);
  
  return Tweets;
})
