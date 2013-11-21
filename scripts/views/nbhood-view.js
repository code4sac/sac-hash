define(['backbone',
		'communicator',
		'store',
		'hbs!tmpl/nbhood-template',
		'map',
		'hbs!tmpl/infobox-template',
		'hbs!tmpl/modal-template',
		'hbs!tmpl/tweet',
		'collections/ranges-collection',
		'infobox',
		'polygonContains'], 
function(Backbone,
		Communicator,
		store,
		nbhoodTemplate,
		map,
		infoboxTemp,
		modalTemp,
		tweetTemp,
		rangesCollection){
	'use strict';

	String.prototype.parseURL = function() {
		return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
			return url.link(url);
		});
	};
	String.prototype.parseHashtag = function() {
		return this.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
			var tag = t.replace("#","%23")
			return t.link("http://search.twitter.com/search?q="+tag);
		});
	};
	String.prototype.parseUsername = function() {
		return this.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
			var username = u.replace("@","")
			return u.link("http://twitter.com/"+username);
		});
	};

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
			var watchedItems = store.get('watched');

			// checks local storage for watched neighborhoods
			// if ( watchedItems && watchedItems.indexOf(this.model.cid) > -1){
			// 	this.model.set('watched', true);
			// }
		},

		onRender: function(){
			var self = this;
				

			this.createPolygon();
			this.infoBox();
			this.watched();
			

			// close open infobox when another is clicked
			Communicator.events.on('clicked', function(){
				self.model.get('infobox').close();
			});

			// trigger showTweets when neighborhood is selected from search autocomplete
			Communicator.events.on('searchSelected', function( model ){
				if (self.model.cid == model.cid){
					self.showTweets();
				}
			});

			// trigger check if address search result is in neighborhood bounds
			Communicator.events.on('addressSearch', function( place ){
				self.addressSearch( place );
			});
		},

		addressSearch: function( place ){

			var polygon = this.model.get('poly'),
				contains = polygon.containsLatLng( place.geometry.location ),
				self = this,
				modalInfo = {
					place: place
				};

				function destroyModal(){
					$('#modal').remove();
				}

				if (contains == true){
					modalInfo.name = this.model.get('NAME2');

					Communicator.events.trigger('clicked');

					// $('body').append( modalTemp(modalInfo) );
					
					$('.close-modal').on('click', function(){
						destroyModal();
						Communicator.events.trigger('closeSearchPanel');
					});

					$('.show-tweets').on('click', function(){
						destroyModal();
						
						Communicator.events.trigger('closeSearchPanel');
					});

					$('.watch-nbhood').on('click', function(){
						destroyModal();
						Communicator.events.trigger('closeSearchPanel');
						self.model.set('watched', true);
						self.watched();
						self.showTweets();
					});
					self.showTweets();

				}
			
		},

		watched: function(){
			if ( this.model.get('watched') == true ){
				this.$el.addClass('watched');
				this.$el.insertAfter( $('#sort-by') );
			}
		},

		showTweets: function(){
			var hashtag = this.model.get('hashtag'),
				ib = this.model.get('infobox'),
				marker = this.model.get('marker'),
				center = this.model.get('center'),
				dom = this.$el,
				num = 10;

			Communicator.events.trigger('clicked');

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

			if ($(window).scrollTop() > 0){
				$('html, body').animate({'scrollTop':0}, 100, function(){
					map.panTo( center );
				});
			} else {
				map.panTo( center );
			}

			$.ajax({
		  		type: 'GET',
		  		url: 'data/tweets_by_tag.json',
			}).done(function(data){
				
				$('.tweet-header h5').text('Showing tweets for #'+hashtag);
				$('.tweet-container').empty()
				for (var i = 0; i < data.length; i++){
					var status = data[i],
	    				date = status.created_at;
	    				
				    status.tweet_text = status.tweet_text.parseURL().parseHashtag().parseUsername();
				    date = new Date(date.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/,"$1 $2 $4 $3 UTC"));
				    status.created_at = timeSince(date);

				    $('.tweet-container').append(tweetTemp(status));
				}

			});

			ib.open(map, marker);
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
				
				// paths = paths.match('<coordinates>(.*?)</coordinates>');
				// paths = paths[1].match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);
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
                ,pixelOffset: new google.maps.Size(10, -45)
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
				Communicator.events.trigger('clicked');
	    		ib.open(map, marker);
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