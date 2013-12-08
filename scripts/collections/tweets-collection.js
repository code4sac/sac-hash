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
    comparator: function(model){
      return -model.get('tweet_id');
    },
    parse: function(response){
        // var newTweets = response.length,
        //     currentTweets = this.models.length,
        //     diff;

        //     console.log('new:' + newTweets, 'old:' + currentTweets);

        // if ( currentTweets > 0 && newTweets > currentTweets ){
        //     diff = newTweets - currentTweets;
        //     response = response.slice( diff );
        // }

        return response;
    },
    loadTweets: function( hashtag ){
        var self = this;
            
        window.setTimeout(function(){
            self.hashtag = hashtag;
            self.url = 'data/tweets_by_tag.php?hashtag='+hashtag;
            self.reset().fetch({
                success: function() {
                  self.addNew = false;
                }
            });
        }, 400);
    },
    autoLoader: function(){
        var self = this,
            now;

        function getDate(){
           var now = new Date(),
            day = now.getDate().toString(),
            month = parseFloat(now.getMonth().toString()) + 1,
            year = now.getFullYear(),
            hours = now.getHours().toString(),
            minutes = now.getMinutes().toString(),
            seconds = now.getSeconds().toString(),
            time;

            if ( month.length == 1) month = '0' + month;
            if ( day.length == 1) day = '0' + day;
            if ( hours.length == 1) hours = '0' + hours;
            if ( minutes.length == 1) minutes = '0' + minutes;
            if ( seconds.length == 1) seconds = '0' + seconds;
            
            return  year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        }
           
        now = getDate()
            console.log(now)
            // now.replace('/','-')
        window.setInterval(function(){
            // var time = self.models[0].get('created_at');

            var tid = self.models[0].get('tweet_id'); 
            var len = self.models.length -1 ;
            var otid = self.models[len].get('tweet_id');
            for(i = 0; i <= self.models.length -1; i++) {
              console.log(self.models[i].get('tweet_id'));
            }
            console.log('tid', tid);
            console.log('otid', otid);

            //self.url = 'data/tweets_by_tag.json?hashtag=' + self.hashtag + '&ntd=' + now;

            self.url = 'data/tweets_by_tag.php?hashtag=' + self.hashtag + '&ntid=' + tid;
            console.log(self.url);
            
            self.fetch({
              remove: false,
              success: function(data){
                console.log('DATA', data);
                self.addNew = true;
              }
            });
            now = getDate();
        }, 5000);
    }
  });

  var Tweets = new tweetCollection([]);
  
  return Tweets;
})
