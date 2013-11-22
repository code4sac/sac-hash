define(['backbone','communicator','views/tweet-view','hbs!tmpl/tweets-template','isotope'], function(Backbone, Communicator, tweetView, tweetsTemplate){
	'use strict';

	return Backbone.Marionette.CompositeView.extend({
		itemView: tweetView,
		template: {
			type: 'handlebars',
			template: tweetsTemplate
		},

		onRender: function(){

			
		},
		appendHtml: function(collectionView, itemView, index){
			var container = this.$el.find('.tweet-container'),
				tweetWidth = Math.floor(container.width() / 3) - 10,
				tweets = itemView.$el.width( tweetWidth );

			if (!container.hasClass('.isotope'))
			container.isotope({
				itemSelector: '.tweet',
				masonry: {
   					columnWidth: tweetWidth + 10,
   					gutterWidth: 10,
   					resizesContainer: true
  				}
			});
			else
			container.isotope('remove', this.previousTweets );
			
			this.previousTweets = tweets;
    		collectionView.$('.tweet-container').isotope( 'insert', tweets );
  		}
	});

});