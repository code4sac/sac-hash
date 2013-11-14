define(['backbone', 'communicator', 'map', 'hbs!tmpl/map-controls-template','geolocation'], function(Backbone, Communicator, map, mapControlsTemp){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		template: mapControlsTemp,
		
		events: {
			'click .zoom-in':'zoomIn',
			'click .zoom-out':'zoomOut',
			'click .geo-location':'geoLocation',
			'click .search-location':'addressSearch'
		},
		
		onRender: function(){
			if( !navigator.geolocation ){
			    handleNoGeolocation(false);
			}
			var center = new google.maps.LatLng(map.center.ob, map.center.pb);
			var defaultBounds = new google.maps.LatLngBounds( center, center);
    
		    var input = this.$el.find('#search-box')[0];
		    var searchBox = new google.maps.places.Autocomplete( input );
		        searchBox.setBounds( defaultBounds );

		    google.maps.event.addListener(searchBox, 'place_changed', function() {
		      var place = searchBox.getPlace();

		      var marker = new google.maps.Marker({
		        map: map,
		        position: place.geometry.location
		      });

		      Communicator.events.trigger('addressSearch', place);

		    });
		},

		zoomIn: function(){
			var zoom = map.getZoom();
        	map.setZoom( zoom + 1 );
		},

		zoomOut: function(){
			var zoom = map.getZoom();
        	map.setZoom( zoom - 1 );
		},

		geoLocation: function(){
			function onSuccess(a){
				console.log('success', a)
			}
			function onError(a){
				console.log('error',a)

			}
			function onProgress(a){
				console.log('progress',a)

			}
			navigator.geolocation.getAccurateCurrentPosition(onSuccess, onError, onProgress, {desiredAccuracy:20, maxWait:15000});


		},

		addressSearch: function(){
      		this.$el.find('#search-panel').show();
		}
	});
});
