define(['backbone'], function( Backbone ){
  'use strict';

  return Backbone.Model.extend({
    initialize: function(){
      this.parseEntities();
      this.set('time_since', this.dateFormat( this.get('created_at') ));
    },
    parseEntities: function(){
      var tweet = this.get('tweet_text');

      if (!tweet) return;

      String.prototype.parseURL = function() {
        return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
          if (!url) return;
          var str = '<a target="_blank" href="' + url + '">' + url + '</a>';
          return url.replace(url, str);
        });
      };
      String.prototype.parseHashtag = function() {
        return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
          var tag = t.replace("#","%23")
          var str = '<a target="_blank" href="https://twitter.com/search?q=' + tag + '">' + t + '</a>';
          return t.replace(t, str);
        });
      };
      String.prototype.parseUsername = function() {
        return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
          var username = u.replace("@","");
          var str = '<a target="_blank" href="http://twitter.com/' + username + '">' + u + '</a>';
          return u.replace(u, str);
        });
      };

      this.set('tweet_text', tweet.parseURL().parseHashtag().parseUsername());
    },
    dateFormat: function( time ) {
      var date = new Date(Date.parse(time)),
      seconds = Math.floor((new Date() - date) / 1000),
      interval = Math.floor(seconds / 31536000);

      // set time in seconds for isotope sorting
      this.set('time_stamp', seconds);

      if (interval > 1) {
          return interval + "y";
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
        return parseFloat(date.getMonth()) + 1 + '/' + date.getDay();
          return interval + "m";
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
          return interval + "d";
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
          return interval + "h";
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
          return interval + "m";
      }
      if ( Math.floor(seconds) < 0 )
        return '<span class="new">new</span>';

      return Math.floor(seconds) + "s";
    }
  });
});
