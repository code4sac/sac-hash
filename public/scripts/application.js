define(['backbone', 'communicator', 'twitter-entities', 'map', 'views/nbhoods-view', 'collections/nbhoods-collection', 'views/ranges-view', 'collections/ranges-collection', 'views/map-controls-view', 'collections/tweets-collection', 'views/tweets-view', 'hbs!tmpl/tweet', 'interface'], function(Backbone, Communicator, tweetParse, map, nbhoodsView, nbhoodsCollection, rangesView, rangesCollection, mapControlsView, tweetsCollection, tweetsView, tweet_tmp) {
  'use strict';

  var App = new Backbone.Marionette.Application();

  // application regions
  App.addRegions({
    nbhoods: '#nbhoods',
    mapKey: '#map-key',
    mapControls: '#map-controls',
    tweets: '#tweet-feed'
  });

  // fetch neighborhood data
  nbhoodsCollection.fetch({
    success: function(){
      $('#loader').remove();
    }
  });

  // render app after data is loaded
  nbhoodsCollection.on('sync', function(model, xhr, options){
    App.addInitializer( function(){
      App.nbhoods.show( new nbhoodsView({ collection: nbhoodsCollection }) );
      App.mapKey.show( new rangesView({ collection: rangesCollection }) );
      App.mapControls.show( new mapControlsView() );
      App.tweets.show( new tweetsView({ collection: tweetsCollection }) );
    });

    tweetsCollection.initialLoad();

    nbhoodsCollection.off('sync');
  });

  return App;
});