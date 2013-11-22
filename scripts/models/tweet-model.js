define(['backbone'], function( Backbone ){
	'use strict';

	return Backbone.Model.extend({
		initialize: function(){
			this.parseEntities();
			this.dateFormat();
		},
		parseEntities: function(){
			var tweet = this.get('tweet_text');

			if (!tweet) return;

			String.prototype.parseURL = function() {
				return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
					if (!url) return;
					return url.link(url);
				});
			};
			String.prototype.parseHashtag = function() {
				return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
					var tag = t.replace("#","%23")
					return t.link("http://search.twitter.com/search?q="+tag);
				});
			};
			String.prototype.parseUsername = function() {
				return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
					var username = u.replace("@","")
					return u.link("http://twitter.com/"+username);
				});
			};

			this.set('tweet_text', tweet.parseURL().parseHashtag().parseUsername());
		},
		dateFormat: function() {

		    var date = new Date(this.get('created_at').replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/,"$1 $2 $4 $3 UTC")),
		    	seconds = Math.floor((new Date() - date) / 1000),
		    	interval = Math.floor(seconds / 31536000),
		    	formatted;

		    if (interval > 1) {
		        formatted = interval + "y";
		    }
		    interval = Math.floor(seconds / 2592000);
		    if (interval > 1) {
		        formatted = interval + "m";
		    }
		    interval = Math.floor(seconds / 86400);
		    if (interval > 1) {
		        formatted = interval + "d";
		    }
		    interval = Math.floor(seconds / 3600);
		    if (interval > 1) {
		        formatted = interval + "h";
		    }
		    interval = Math.floor(seconds / 60);
		    if (interval > 1) {
		        formatted = interval + "m";
		    }
			formatted = Math.floor(seconds) + "s";
		    
		    this.set('created_at', formatted);
		}
	});
});