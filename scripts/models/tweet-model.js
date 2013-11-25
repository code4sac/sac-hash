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
        /*
        console.log(this.get('created_at'));
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
        */

        /* Kaleb Attempt
         * ============= */
         var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
         var rda = this.get('created_at').split(' ');
         var date_array = rda[0].split('-');
         var time_array = rda[1].split(':');
         var raw_date = new Date(
           date_array[0],
           date_array[1] -1,
           date_array[2],
           time_array[0],
           time_array[1],
           time_array[2]
         );
         var m  = raw_date.getMonth();
         var y  = raw_date.getFullYear().toString().substr(2,2);
         var d  = raw_date.getDate();

         var h  = raw_date.getHours();
         h = (h < 10) ? ("0" + h) : h;
         var i  = raw_date.getMinutes();
         i = (i < 10) ? ("0" + i) : i;
         var s  = raw_date.getSeconds();
         s = (s < 10) ? ("0" + s) : s;

         var formatted = months[m]+" "+d+" '"+y+" "+h+":"+i;
         this.set('created_at', formatted);
		    
		}
	});
});
