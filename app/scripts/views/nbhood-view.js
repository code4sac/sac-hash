define(['backbone','hbs!tmpl/nbhood-template','map'], function(Backbone, nbhoodTemplate, map){
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
				'data-count': this.model.get('count'),
				// 'style': 'background-color:'+this.model.get('color')+';'
			}
		},

		showTweets: function(){
			var hashtag = this.model.get('hashtag'),
				dom = this.$el,
				num = 10,
				expand = 2,
				index = dom.index(),
				height = dom.innerHeight() + 1,
				offset = dom.offset().left,
				moved = $('.moved');

			// function animateBlocks(){
			// 	dom.animate({'height':'420px'},200, function(){
			// 		$('.nbhood').each(function(){
			// 			var block = $(this);
						
			// 			if ( block.offset().left < offset && block.index() > index ){
			// 				block.animate({'top': (height * expand) * -1}, 100).addClass('moved')
			// 			}
			// 		})
			// 	}).addClass('moved');
			// }

			$.ajax({
		  		type: 'GET',
		  		url: '/tweets/'+hashtag+'/'+num,
			}).done(function(data){
				console.log(data)
			});

			// if (moved.is('*'))
			// 	$('.moved').animate({'height':height,'top':0}, 0, animateBlocks);
			// else
			// 	animateBlocks();

			

			
			
			// this.$el.parent().find('.nbhood:nth-child(4n+2)').css('background-color','green')
		},

		createPolygon: function(){
			var paths = this.model.get('geometry'),
				coordinates = [],
				poly,
				color = this.model.get('color');

				paths = paths.match('<coordinates>(.*?)</coordinates>');
				paths = paths[1].match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);

			for (var i = 0; i < paths.length; i++){
				var coords = paths[i].split(',')
				coordinates.push( new google.maps.LatLng(coords[1],coords[0]) )	
			}
			
			poly = new google.maps.Polygon({
			    paths: coordinates,
			    strokeColor: '#000000',
			    strokeOpacity: 0.2,
			    strokeWeight: 1,
			    fillColor: color,
			    fillOpacity: 0.8
			});

			poly.setMap(map)

			this.model.set('poly', poly)
		},

		heatMap: function(){
	
		},
		
		onRender: function(){
			this.createPolygon();
		}
	});
});