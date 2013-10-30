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
	'interface'
],

function( Backbone, Communicator, tweetParse, map, nbhoodsView, nbhoodsCollection, rangesView, rangesCollection, tweet_tmp) {
    'use strict';

	var App = new Backbone.Marionette.Application();

	// application regions
	App.addRegions({
		blockView: '#block-view',
		mapKey: '#map-key'
	});

	// append loader
	$('body').append('<div id="loader"><div class="loadable loading"> <div class="loadable-content"></div> <div class="loadable-progress"> <div class="loading-spinner"></div></div></div>LOADING DATA</div>');
	
	// fetch neighborhood data
	nbhoodsCollection.fetch({
		success: function(){
			$('#loader').hide();
		}
	})
    
    // render app after data is loaded
    nbhoodsCollection.on('sync', function(model, xhr, options){
   	  	App.addInitializer( function(){
			App.blockView.show( new nbhoodsView({ collection: nbhoodsCollection }) );
			App.mapKey.show( new rangesView({ collection: rangesCollection }) );
		});

		nbhoodsCollection.off('sync');
    });

	return App;
});
