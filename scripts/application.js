define([
	'backbone',
	'communicator',
	'tweetparse',
	'map',
	'views/nbhoods-view',
	'collections/nbhoods-collection',
	'views/ranges-view',
	'collections/ranges-collection',
	'hbs!tmpl/tweet',
],

function( Backbone, Communicator, tweetParse, map, nbhoodsView, nbhoodsCollection, rangesView, rangesCollection, tweet_tmp) {
    'use strict';

	var App = new Backbone.Marionette.Application();

	/* Add application regions here */
	App.addRegions({
		blockView: '#block-view',
		mapKey: '#map-key'
	});

	/* Add initializers here */
		App.addInitializer( function(){
			App.blockView.show( new nbhoodsView({ collection: nbhoodsCollection }) );
			App.mapKey.show( new rangesView({ collection: rangesCollection }) );
		});
	
	

	$('#toggle-search').on('click', function(event){
		var target = $(event.target),
			wrapper = target.closest('li'),
			panel = wrapper.find('#search-panel');

		if (target.hasClass('search-active')){
			wrapper.animate({'width':'44px'}, 150);
			target.removeClass('glyphicon-remove').addClass('glyphicon-search');
			panel.hide();

			target.removeClass('search-active');
		} else {
			wrapper.animate({'width':'500px'}, 150);
			target.removeClass('glyphicon-search').addClass('glyphicon-remove');
			panel.show();

			target.addClass('search-active');
		}
	});

	return App;
});
