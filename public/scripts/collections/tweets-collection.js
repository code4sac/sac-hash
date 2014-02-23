define(['backbone','communicator','models/tweet-model'], function( Backbone, Communicator, tweetModel) {
  'use strict';

  function keywordQuery(keywords) {
    return (keywords||[]).map(function(keyword) {
      return 'keywords[]=' + encodeURIComponent(keyword);
    }).join('&');
  }

  var tweetCollection = Backbone.Collection.extend({
    model: tweetModel,

    comparator: function(model){
      return -model.get('id');
    },

    initialize: function(){
      var self = this;

      /* Fetch tweets when tag / map nbhood is clicked
       * ============================================= */
      Communicator.events.on('clicked', function( keywords ){
        self.autoLoader('stop');
        self.loadTweets( keywords );
      });
    },

    initialLoad: function(){
      var self = this;

      this.keywords = ['#downtownsac'];
      this.url = 'api/tweets.json?' + keywordQuery([this.keywords]);

      this.fetch({
        success: function(){
          if(self.models.length > 0) {
            self.tid = self.models[0].get('id');
          }
          self.autoLoader('start');
        }
      });
    },

    loadTweets: function( keywords ){
        var self = this;

        window.setTimeout(function(){
          self.keywords = keywords;

          self.url = 'api/tweets.json?'+keywordQuery(keywords);

          self.reset().fetch({
            success: function() {
              self.sort();
              if(self.models.length > 0) {
                self.tid = self.models[0].get('id');
              }
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
      otid = self.models[ self.models.length - 1 ].get('id');
      self.each(function(model){
        console.log(i + '- id', model.get('id'))
      });
      console.log('tid', tid, 'otid', otid);
      */

      function findNewTweets(){
        var keywords = keywordQuery(self.keywords);

        self.url = 'api/tweets.json?' + keywords + '&ntid=' + (self.tid||0);

        $.ajax({
          url: self.url,
          success: function(data){
            var dataSorted = _.sortBy(data, function(tweet){
              return -tweet.id;
            });
            if(data.length > 0) {
              self.tid = dataSorted[0].id;
            }
            Communicator.events.trigger('autoLoad', dataSorted);
          }
        });
      }
    }
  });

  var Tweets = new tweetCollection([]);

  return Tweets;
});