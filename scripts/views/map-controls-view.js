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

		},

		addressSearch: function(){

		}
	});
});