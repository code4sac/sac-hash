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
		dateFormat: function( time ) {
        	
        	var rda = time.split(' '),
	       		date_array = rda[0].split('-'),
	       		time_array = rda[1].split(':'),
	       		date = new Date(
		           date_array[0],
		           date_array[1] -1,
		           date_array[2],
		           time_array[0],
		           time_array[1],
		           time_array[2]
	        	),
		    	seconds = Math.floor((new Date() - date) / 1000),
		    	interval = Math.floor(seconds / 31536000);

		    // set time in seconds for isotope sorting
		    this.set('time_stamp', seconds);

		    if (interval > 1) {
		        return interval + "y";
		    }
		    interval = Math.floor(seconds / 2592000);
		    if (interval > 1) {
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
			return Math.floor(seconds) + "s";		    
		}
	});
});
