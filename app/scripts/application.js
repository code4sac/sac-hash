define([
	'backbone',
	'communicator',
	'map',
	'tweetparse',
	'collections/neighborhoods-collection',
	'hbs!tmpl/tweet'
],

function( Backbone, Communicator, map, tweetParse, nbhoodsCollection, tweet_tmp) {
    'use strict';

	var App = new Backbone.Marionette.Application();

	/* Add application regions here */
	App.addRegions({});

	/* Add initializers here */
	App.addInitializer( function () {
		
	});
	var count = 0;
	console.log(nbhoodsCollection)
	var socket = io.connect('http://localhost:9000');
	  
	  socket.on('tweet', function (data) {
	    var tweet = linkify_entities(data);
	    data.entities.text = tweet

	    count++;

	    $('.tweet-container').append(tweet_tmp(data));
	    $('#count span').text(count);

	    socket.emit('my other event', { my: 'data' });
	  });
    	
	// console.log(nbhoods)
	// for (var i = 0; i <= 129 ; i++){
	// 	document.write(nbhoods['features'][i]['properties']['NAME']+'<br>')
	// }
	$.ajax({
  		type: "GET",
  		url: "/tweets/cfabrigade/200",
	}).done(function(data) {
		console.log(data)
  		for (var i = 0; i < data['statuses'].length; i++){
  			var geo = data['statuses'][i]['coordinates'],
  				lat,
  				lng,
  				point;

  			if (geo){
  				lat = geo.coordinates[1];
  				lng = geo.coordinates[0];

  				point = new google.maps.LatLng(lat, lng);
  				
  				new google.maps.Marker({
		            map: map,
		            position: point,
        		});
        		
  			}
  		}
  		
	});

	return App;
});
