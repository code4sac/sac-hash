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

        this.autoLoader();
    },
    loadTweets: function( hashtag ){
      var self = this;
            $('#loader').show();
            
            window.setTimeout(function(){
              self.url = 'data/tweets_by_tag.json?hashtag='+hashtag;
              self.reset().fetch({
                success: function() {
                  $('#loader').hide();  
                  console.log(self)
                }
              });
            }, 400);
    },
    autoLoader: function(){
      var self = this;
      
        // window.setInterval(function(){
          
        //   self.fetch({
        //     remove: false,
        //     success: function(data){
        //       console.log(data)
        //     }
        //   })
        // }, 1000);
    }
  });

  var Tweets = new tweetCollection([]);
  
  return Tweets;
})
