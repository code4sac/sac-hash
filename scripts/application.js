define([
	'backbone',
	'communicator',
	'tweetparse',
	'map',
	'views/nbhoods-view',
	'collections/nbhoods-collection',
	'views/ranges-view',
	'collections/ranges-collection',
	'views/map-controls-view',
	'hbs!tmpl/tweet',
	'interface'
],

function( Backbone, Communicator, tweetParse, map, nbhoodsView, nbhoodsCollection, rangesView, rangesCollection, mapControlsView, tweet_tmp) {
    'use strict';

	var App = new Backbone.Marionette.Application();

	// application regions
	App.addRegions({
		blockView: '#block-view',
		mapKey: '#map-key',
		mapControls: '#map-controls'
	});

	// append loader
	$('body').append('<div id="loader"><div class="loadable loading"> <div class="loadable-content"></div> <div class="loadable-progress"> <img class="loader-hexagon" src="styles/hexagon.svg"><div class="loading-spinner"></div></div></div><span>LOADING DATA</span></div>');
	
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
			App.mapControls.show( new mapControlsView() );
		});

		nbhoodsCollection.off('sync');
    });

	return App;
});
