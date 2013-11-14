define(['backbone', 'map', 'hbs!tmpl/map-controls-template'], function(Backbone, map, mapControlsTemp){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		template: mapControlsTemp,
		
		events: {
			'click .zoom-in':'zoomIn',
			'click .zoom-out':'zoomOut',
			'click .geo-location':'geoLocation',
			'click .address-search':'addressSearch'
		},
		
		onRender: function(){
			if( !navigator.geolocation ){
			    handleNoGeolocation(false);
			}
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

			    navigator.geolocation.getCurrentPosition(function(position) {
			      var pos = new google.maps.LatLng(position.coords.latitude,
			                                       position.coords.longitude);

			      var infowindow = new google.maps.InfoWindow({
			        map: map,
			        position: pos,
			        content: 'Location found using HTML5.'
			      });

			      map.setCenter(pos);
			    }, function() {
			      handleNoGeolocation(true);
			    });
		},

		addressSearch: function(){

		}
	});
});