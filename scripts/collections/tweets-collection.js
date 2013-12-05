define(['backbone','communicator','models/tweet-model'], function( Backbone, Communicator, tweetModel){
  'use strict';

  var tweetCollection = Backbone.Collection.extend({
    model: tweetModel,
    initialize: function(){
      	var self = this,
            currentHashtag;
      	
        /* Fetch tweets when tag / map nbhood is clicked
         * ============================================= */
      	Communicator.events.on('clicked', function( hashtag ){
          
          $('#loader').show();
          
          currentHashtag = hashtag;
      		
          window.setTimeout(function(){
  				  self.url = 'data/tweets_by_tag.json?hashtag='+hashtag;
  				  self.reset().fetch({
              success: function() {
                $('#loader').hide();  
              }
            });
  			  }, 200);

      	});

        this.autoLoader();
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
