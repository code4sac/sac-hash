define(['backbone','communicator','views/tweet-view','hbs!tmpl/tweets-template','isotope'], function(Backbone, Communicator, tweetView, tweetsTemplate){
	'use strict';

	return Backbone.Marionette.CompositeView.extend({
		itemView: tweetView,
		template: {
			type: 'handlebars',
			template: tweetsTemplate
		},

		ui: {
			container: '.tweet-container'
		},

		initialize: function(){
			var self = this;
			Communicator.events.on('clicked', function(){
				if (self.ui.container.hasClass('isotope'))
				self.ui.container.isotope('remove', self.$el.find('.tweet'));
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
			
    		container.isotope( 'insert', tweets );
  		}
	});

});