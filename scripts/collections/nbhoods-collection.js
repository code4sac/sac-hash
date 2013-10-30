define(['backbone','communicator','models/nbhood-model'], function( Backbone, Communicator, nbhoodModel){
  'use strict';

  var nbhoodCollection = Backbone.Collection.extend({
    model: nbhoodModel,
    url: 'data/alldata.php'
  });

  var Neighborhoods = new nbhoodCollection([]);
  
  return Neighborhoods;
})
