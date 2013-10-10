define([
	'backbone',
	'communicator',
	'tweetparse',
	'map',
	'views/nbhoods-view',
	'collections/nbhoods-collection',
	'hbs!tmpl/tweet',
],

function( Backbone, Communicator, tweetParse, map, nbhoodsView, nbhoodsCollection, tweet_tmp) {
    'use strict';

	var App = new Backbone.Marionette.Application();

	/* Add application regions here */
	App.addRegions({
		blockView: '#block-view',
		mapView: '#map-view'
	});

	/* Add initializers here */
	App.addInitializer( function () {
		App.blockView.show( new nbhoodsView({ collection: nbhoodsCollection }) )
	});

	var count = 0;


	var socket = io.connect('http://localhost:9000');
	  
	  socket.on('tweet', function (data) {

	  	function timeSince(date) {

		    var seconds = Math.floor((new Date() - date) / 1000);

		    var interval = Math.floor(seconds / 31536000);

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

	    var tweet = linkify_entities(data.tweet),
	    	date = data.tweet.created_at;

	    data.tweet.entities.text = tweet;
	    date = new Date(date.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/,"$1 $2 $4 $3 UTC"));
	    data.tweet.created_at = timeSince(date);
	    count++;

	    for (var i = 0; i < data.matchedTags.length; i++){

	    	var tagDom = $('#map-canvas [data-hashtag="'+data.matchedTags[i]+'"] span'),
	    		tagCount = parseFloat(tagDom.text()) + 1;
	    	tagDom.text(tagCount)
	    	console.log(tagDom)
	    }

	    $('.tweet-container').prepend(tweet_tmp(data.tweet));

	    socket.emit('my other event', { my: 'data' });
	  });
    	
	// console.log(nbhoods)
	// for (var i = 0; i <= 129 ; i++){
	// 	document.write(nbhoods['features'][i]['properties']['NAME']+'<br>')
	// }
	// $.ajax({
 //  		type: "GET",
 //  		url: "/tweets/sacramento/1",
	// }).done(function(data) {
		
 //  		for (var i = 0; i < data['statuses'].length; i++){
 //  			var geo = data['statuses'][i]['coordinates'],
 //  				lat,
 //  				lng,
 //  				point;
 //  				console.log(data)
 //  			if (geo){
 //  				lat = geo.coordinates[1];
 //  				lng = geo.coordinates[0];

 //  				point = new google.maps.LatLng(lat, lng);
  				
 //  				new google.maps.Marker({
	// 	            map: map,
	// 	            position: point,
 //        		});
        		
 //  			}
 //  		}
  		
	// });

	return App;
});
