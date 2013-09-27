define([
	'backbone',
	'communicator',
	'tweetparse',
	'collections/neighborhoods-collection',
	'hbs!tmpl/tweet'
],

function( Backbone, Communicator, tweetParse, nbhoodsCollection, tweet_tmp) {
    'use strict';

	var App = new Backbone.Marionette.Application();

	/* Add application regions here */
	App.addRegions({

	});

	/* Add initializers here */
	App.addInitializer( function () {
		
	});
	var count = 0;

	var socket = io.connect('http://localhost:9000');
	  
	  socket.on('tweet', function (data) {
	    var tweet = linkify_entities(data.tweet);
	    data.tweet.entities.text = tweet;
	    
	    count++;

	    for (var i = 0; i < data.matchedTags.length; i++){

	    	var tagDom = $('#map-canvas [data-hashtag="'+data.matchedTags[i]+'"] span'),
	    		tagCount = parseFloat(tagDom.text()) + 1;
	    	tagDom.text(tagCount)
	    	console.log(tagDom)
	    }

	    $('.tweet-container .tweets').prepend(tweet_tmp(data.tweet));
	    $('#count span').text(count);

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
