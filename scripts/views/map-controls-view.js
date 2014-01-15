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
			
			setTimeout(function(){
				$('#welcome-modal').animate({ 'opacity':'1', 'margin-top':'0px' }, 100);
				$(document).on('click', '#map-canvas, #nbhoods, .search-location', function(){ $('.modal').hide(); });
			}, 700)
		},

		initAddressSearch: function(){
			// initialize address search
			var self = this,
				center = new google.maps.LatLng(38.575067, -121.487761),
				defaultBounds = new google.maps.LatLngBounds( center, center ),
		    	input = this.$el.find('#search-box')[0],
		    	searchBox = new google.maps.places.Autocomplete( input );
		 
		    searchBox.setBounds( defaultBounds );
			
			google.maps.event.addListener(searchBox, 'place_changed', function() {
		      	if (self.marker) self.marker.setMap(null);
		      	
		      	var place = searchBox.getPlace(),
		      		marker = new google.maps.Marker({
		        		map: map,
		        		position: place.geometry.location,
		        		animation: google.maps.Animation.DROP
		      		});
				
				self.$el.find('#search-box').val('');
		      	self.$el.find('#search-panel').toggle();
				self.marker = marker;
				
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
