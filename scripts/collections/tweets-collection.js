define(['backbone','communicator','models/tweet-model'], function( Backbone, Communicator, tweetModel){
  'use strict';

  var tweetCollection = Backbone.Collection.extend({
    model: tweetModel,
    
    comparator: function(model){
      return -model.get('tweet_id');
    },
    
    initialize: function(){
      	var self = this;
      	
        /* Fetch tweets when tag / map nbhood is clicked
         * ============================================= */
      	Communicator.events.on('clicked', function( hashtag ){
          	self.autoLoader('stop');
          	self.loadTweets( hashtag );
      	});
    },
    
    initialLoad: function(){
    	var self = this;
    	
    	this.url = 'data/tweets_by_tag.php?hashtag=downtownsac';
		this.hashtag = 'downtownsac';
		
		this.fetch({
			success: function(){
				self.tid = self.models[0].get('tweet_id');
                console.log(self.tid)
                self.autoLoader('start');
			}
		});
    },
    
    loadTweets: function( hashtag ){
        var self = this;
            
        window.setTimeout(function(){
            self.hashtag = hashtag;
            self.url = 'data/tweets_by_tag.php?hashtag='+hashtag;
            self.reset().fetch({
                success: function() {
                	self.sort();
                	self.tid = self.models[0].get('tweet_id');
                	console.log(self.tid)
                  	self.autoLoader('start'); 	
                }
            });
        }, 400);
    },
    
    autoLoader: function( action ){
    
        var self = this,
        	tid,
        	otid;
		
		if ( action == 'stop' ){
			clearInterval(self.autoLoadTimer);
			return;
		} else if ( action == 'start' ){
			self.autoLoadTimer = setInterval( findNewTweets, 5000 );
		} 
		
		// initial otid & ntid
        /*
otid = self.models[ self.models.length - 1 ].get('tweet_id'); 
 		self.each(function(model){
 			console.log(i + '- id', model.get('tweet_id'))
 		});
 		console.log('tid', tid, 'otid', otid);
*/
           
        function findNewTweets(){
			
            self.url = 'data/tweets_by_tag.php?hashtag=' + self.hashtag + '&ntid=' + self.tid;
            
            $.ajax({
                url: self.url,
                success: function(data){
                	if (data.length == 0) return;
                	var dataSorted = _.sortBy(data, function(tweet){ 
                		return -tweet.tweet_id; 
                	});
                	self.tid = dataSorted[0].tweet_id;
                    Communicator.events.trigger('autoLoad', dataSorted);
                }
            });

        }
    }
  });

  var Tweets = new tweetCollection([]);
  
  return Tweets;
})
