define(['backbone','communicator','models/nbhood-model'], function( Backbone, Communicator, nbhoodModel){
  'use strict';

  var nbhoodCollection = Backbone.Collection.extend({
    model: nbhoodModel,
    url: '/data/alldata.json'
  });

  var Neighborhoods = new nbhoodCollection([]);

  Neighborhoods.fetch({ 
    error: function(collection, response, options){
    }, 
    success: function(collection, response, options){
      
    }
  });console.log(Neighborhoods)
  return Neighborhoods;
})
