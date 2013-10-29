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

	$('#toggle-nav').on('click', function(event){
		var self = $(this);

		if (self.hasClass('nav-active')){
			$('.drop-down').animate({'height':'10px'}, 100 , function(){
				$(this).animate({'width':'0'}, 70, function(){
					$(this).css({'top':'66px','opacity':'0','width':'200px','height':'auto'});
				});
			});
			self.removeClass('nav-active');
		} else {
			$('.drop-down').show(0).animate({'top':'60px','opacity':'1'}, 260);
			self.addClass('nav-active');
		}
		
	});


	return App;
});
