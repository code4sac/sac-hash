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
			this.initAddressSearch();
		},

		initAddressSearch: function(){
			// initialize address search
			var self = this,
				center = new google.maps.LatLng(map.center.pb, map.center.qb),
				defaultBounds = new google.maps.LatLngBounds( center, center ),
		    	input = this.$el.find('#search-box')[0],
		    	searchBox = new google.maps.places.Autocomplete( input );
		    console.log(defaultBounds, map.center)
		    searchBox.setBounds( defaultBounds );

			google.maps.event.addListener(searchBox, 'place_changed', function() {
		      	var place = searchBox.getPlace(),
		      		marker = new google.maps.Marker({
		        		map: map,
		        		position: place.geometry.location
		      		});
				
				self.$el.find('#search-box').val('');
		      	self.$el.find('#search-panel').toggle();

		      	Communicator.events.trigger('addressSearch', place);
		    });
		},

		zoomIn: function(){
			var zoom = map.getZoom();
        	map.setZoom( zoom + 1 );
        	Communicator.events.trigger('zoom', zoom + 1);
		},

		zoomOut: function(){
			var zoom = map.getZoom();
        	map.setZoom( zoom - 1 );
        	Communicator.events.trigger('zoom', zoom - 1);
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

		addressSearch: function(e){
			
			if ($(e.target).closest('#search-panel').length == 0){
				this.$el.find('#search-panel').toggle();
				this.$el.find('#search-box').val('').focus();
			}
      		
		}
	});
});
