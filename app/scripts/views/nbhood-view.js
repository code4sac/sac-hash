define(['backbone','hbs!tmpl/nbhood-template'], function(Backbone, nbhoodTemplate){
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
				'data-count': this.model.get('count')
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

			function animateBlocks(){
				dom.animate({'height':'420px'},200, function(){
					$('.nbhood').each(function(){
						var block = $(this);
						
						if ( block.offset().left < offset && block.index() > index ){
							block.animate({'top': (height * expand) * -1}, 100).addClass('moved')
						}
					})
				}).addClass('moved');
			}

			$.ajax({
		  		type: 'GET',
		  		url: '/tweets/'+hashtag+'/'+num,
			}).done(function(data){
				console.log(data)
			});

			if (moved.is('*'))
				$('.moved').animate({'height':height,'top':0}, 0, animateBlocks);
			else
				animateBlocks();

			

			
			
			// this.$el.parent().find('.nbhood:nth-child(4n+2)').css('background-color','green')
		},
		
		onRender: function(){
			
		}
	});
});