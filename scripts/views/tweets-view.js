define(['backbone','communicator','views/tweet-view','hbs!tmpl/tweets-template','isotope'], function(Backbone, Communicator, tweetView, tweetsTemplate){
	'use strict';

	return Backbone.Marionette.CompositeView.extend({
		itemView: tweetView,
		template: {
			type: 'handlebars',
			template: tweetsTemplate
		},

		events: {
			'click .sort-tweets span':'sortDate'
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
					self.ui.currentHashtag.css('margin-top','40px').animate({'margin-top':'0'}, 150).text('#' + hashtag);
				});

				if (self.ui.container.hasClass('isotope'))
				self.ui.container.isotope('remove', self.$el.find('.tweet'));

				self.ui.loader.delay(200).fadeIn(200)
			});
		},

		sortDate: function(e){
			var target = $(e.target),
				buttons = this.$el.find('.sort-tweets span');

			
			if (target.hasClass('active-sort')) return;
			else buttons.removeClass('active-sort');
			

			if (target.hasClass('date-new')){
				// target.addClass('active-sort')
				this.ui.container.isotope({ 
			  		sortBy : 'time',
			  		sortAscending : false
				});
				target.addClass('active-sort')

			} 
			if (target.hasClass('date-old')){
				this.ui.container.isotope({ 
			  		sortBy : 'time',
			  		sortAscending : true
				});
				target.addClass('active-sort')
			}
			
		},

		addNewTweets: function(){
		},

		appendHtml: function(collectionView, itemView, index){
			var container = this.ui.container,
				tweetWidth = Math.floor(container.width() / 3) - 10,
				tweets = itemView.$el.css('width', tweetWidth );

			if (container.hasClass('isotope') == false)
			container.isotope({
				itemSelector: '.tweet',
				masonry: {
   					columnWidth: tweetWidth + 10,
   					gutterWidth: 10,
   					resizesContainer: true
  				},
  				getSortData : {
				  time : function ( $elem ) {
				    return $elem.attr('data-time');
				  }
				},
				sortBy : 'time',
  				sortAscending : false
			});
			// else if ( this.collection.addNew == true ){
			// 	container.prepend( tweets ).isotope( 'reloadItems' ).isotope({ sortBy: 'original-order' });

			// }
			// else
			
			this.ui.loader.stop().hide();
			container.isotope( 'insert', tweets );
			
  		}
	});

});