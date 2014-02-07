define(['backbone',
		'communicator',
		'store',
		'hbs!tmpl/nbhood-template',
		'map',
		'hbs!tmpl/infobox-template',
		'hbs!tmpl/tweet',
		'collections/ranges-collection',
		'collections/tweets-collection',
		'isotope',
		'infobox',
		'polygonContains',
		'jqueryui'], 
function(Backbone,
		Communicator,
		store,
		nbhoodTemplate,
		map,
		infoboxTemp,
		tweetTemp,
		rangesCollection,
		tweetsCollection ){
	'use strict';

	return Backbone.Marionette.ItemView.extend({ 
		className: 'nbhood',

		template: {
			type: 'handlebars',
			template: nbhoodTemplate
		},

		events: {
			'click':'showTweets'
		},

		attributes: function(){
			return {
				'data-count': parseFloat(this.model.get('COUNT')),
				'data-name': this.model.get('NAME2'),
				'data-range': this.model.get('range')
			}
		},

		initialize: function(){
			// var watchedItems = store.get('watched');

			// checks local storage for watched neighborhoods
			// if ( watchedItems && watchedItems.indexOf(this.model.cid) > -1){
			// 	this.model.set('watched', true);
			// }
		},

		onRender: function(){
			var self = this;

			this.createPolygon();
			this.infoBox();
			// this.watched();
			
			// close open infobox when another is clicked
			Communicator.events.on('clicked', function(){
				self.model.get('infobox').close();
			});

			// trigger showTweets when neighborhood is selected from search autocomplete
			Communicator.events.on('searchSelected', function( model ){
				if (self.model.cid == model.cid){
					self.showTweets();
				} else {
					self.model.get('infobox').close();
				}
			});

			Communicator.events.on('zoom', function( zoom ){
				var ib = self.model.get('infobox');

				if (ib.getVisible() == true){
					zoom = (zoom * 4.6);
					ib.setOptions({ pixelOffset: new google.maps.Size(10, zoom * -1) });
					ib.draw();
				}
			});
			
		},

		watched: function(){
			if ( this.model.get('watched') == true ){
				this.$el.addClass('watched');
				this.$el.insertAfter( $('#sort-by') );
			}
		},

		showTweets: function( loc ){
			var self = this,
				hashtag = this.model.get('hashtag'),
				ib = this.model.get('infobox'),
				marker = this.model.get('marker'),
				center = this.model.get('center');
			
			
			 if ($(window).scrollTop() > 0){
			 	
			 } else {
				
			 }
			
/* 			map.panTo( center ); */
$('html, body').animate({'scrollTop':0}, 100, function(){
			 		map.panTo( center );
			 	});
			Communicator.events.trigger('clicked', hashtag);
			
			ib.open(map, marker);
			
			if ( loc )
			ib.setPosition( loc.geometry.location );

		},

		createPolygon: function(){
			var paths = this.model.get('geometry'),
				bounds = new google.maps.LatLngBounds(),
				range = this.model.get('range'),
				color = this.model.get('color'),
				coordinates = [],
				infoWindow,
				infoPosition,
				contentString,
				poly,
				center;
				
				paths = paths.geometry.coordinates[0];

			for (var i = 0; i < paths.length; i++){
				var coords = paths[i],
					latLng = new google.maps.LatLng(coords[1],coords[0]);

				coordinates.push( latLng )
				bounds.extend( latLng )
			}

			center = this.GetCentroid(coordinates);
			infoPosition = new google.maps.LatLng(center.lb, center.mb);
			
			poly = new google.maps.Polygon({
			    paths: coordinates,
			    strokeColor: '#000000',
			    strokeOpacity: 0.2,
			    strokeWeight: 1,
			    fillColor: color,
			    fillOpacity: 0.8
			});

			poly.setMap(map)

			this.model.set('center', center);
			this.model.set('poly', poly);
		},

		infoBox: function(){

			var poly = this.model.get('poly'),
				center = this.model.get('center'),
				nbhood = this.model.get('NAME2'),
				hashtag = this.model.get('hashtag'),
				count = this.model.get('COUNT'),
				self = this,
				marker,
				boxText,
				boxOptions,
				ib;

			marker = new google.maps.Marker({
		        map: map,
		        position: center,
		        visible: false
        	});
                
        	boxOptions = {
                 content: infoboxTemp(this.model.attributes)
                ,disableAutoPan: false
                ,maxWidth: 0
                ,pixelOffset: new google.maps.Size(15, -48)
                ,zIndex: null
                // ,closeBoxMargin: "10px 2px 2px 10px"
                ,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
                ,infoBoxClearance: new google.maps.Size(0, 0)
                ,isHidden: false
                ,pane: "floatPane"
                ,enableEventPropagation: false
        	};
		
			ib = new InfoBox(boxOptions);
	        
	        google.maps.event.addListener(poly, 'click', function() {
				var zoom = map.getZoom() * 4;
				ib.setOptions({ pixelOffset: new google.maps.Size(10, zoom * -1) });

	    		self.showTweets();
	  		}); 

	  		this.model.set('infobox', ib);
	  		this.model.set('marker', marker)
		},

		GetCentroid: function(paths){
		    var f;
		    var x = 0;
		    var y = 0;
		    var nPts = paths.length;
		    var j = nPts-1;
		    var area = 0;
		    
		    for (var i = 0; i < nPts; j=i++) {   
		        var pt1 = paths[i];
		        var pt2 = paths[j];
		        f = pt1.lat() * pt2.lng() - pt2.lat() * pt1.lng();
		        x += (pt1.lat() + pt2.lat()) * f;
		        y += (pt1.lng() + pt2.lng()) * f;
		        
		        area += pt1.lat() * pt2.lng();
		        area -= pt1.lng() * pt2.lat();        
		    }
		    area /= 2;
		    f = area * 6;
		    return new google.maps.LatLng(x/f, y/f);
		}
	});
});