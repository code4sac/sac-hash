define(['backbone','communicator','views/tweet-view','hbs!tmpl/tweets-template','isotope'], function(Backbone, Communicator, tweetView, tweetsTemplate){
	'use strict';

	return Backbone.Marionette.CompositeView.extend({
		itemView: tweetView,
		template: {
			type: 'handlebars',
			template: tweetsTemplate
		},

		ui: {
			container: '.tweet-container',
			currentHashtag: '.current-hashtag span',
			loader: '#loader'
		},

		initialize: function(){
			var self = this;

			Communicator.events.on('clicked', function( hashtag ){
				self.ui.currentHashtag.animate({'margin-top':'-40px'}, 150, function(){
					self.ui.currentHashtag.css('margin-top','40px').animate({'margin-top':'0'}, 150).text('Showing tweets for #' + hashtag);
				});

				if (self.ui.container.hasClass('isotope'))
				self.ui.container.isotope('remove', self.$el.find('.tweet'));

				self.ui.loader.delay(200).fadeIn(200)
			});
		},

		appendHtml: function(collectionView, itemView, index){
			var container = this.ui.container,
				tweetWidth = Math.floor(container.width() / 3) - 10,
				tweets = itemView.$el.width( tweetWidth );

			if (container.hasClass('isotope') == false)
			container.isotope({
				itemSelector: '.tweet',
				masonry: {
   					columnWidth: tweetWidth + 10,
   					gutterWidth: 10,
   					resizesContainer: true
  				}
			});
			
			this.ui.loader.stop().hide();
    		container.isotope( 'insert', tweets );
  		}
	});

});