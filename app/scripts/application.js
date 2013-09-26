define([
	'backbone',
	'communicator',
	'map',
	'models/neighborhoods',
	'hbs!tmpl/welcome'
],

function( Backbone, Communicator, map, nbhoods) {
    'use strict';

	var App = new Backbone.Marionette.Application();

	/* Add application regions here */
	App.addRegions({});

	/* Add initializers here */
	App.addInitializer( function () {
		
	});

	var socket = io.connect('http://localhost:9000');
	  
	  socket.on('tweet', function (data) {
	    console.log(data);
	    socket.emit('my other event', { my: 'data' });
	  });
    	
	// console.log(nbhoods)
	// for (var i = 0; i <= 129 ; i++){
	// 	document.write(nbhoods['features'][i]['properties']['NAME']+'<br>')
	// }
	$.ajax({
  		type: "GET",
  		url: "/tweets/midtownsac/100",
	}).done(function(data) {
  		for (var i = 0; i < data['statuses'].length; i++){
  			var geo = data['statuses'][i]['coordinates'],
  				lat,
  				lng,
  				point;

  			console.log(data['statuses'][i])

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
