define(['backbone','communicator','models/nbhood-model'], function( Backbone, Communicator, nbhoodModel) {
  'use strict';

  var nbhoodCollection = Backbone.Collection.extend({
    model: nbhoodModel,
    url: '/api/tags.json',
    comparator: function(model) {
      return -model.get('count');
    }
  });

  var Neighborhoods = new nbhoodCollection([]);

  return Neighborhoods;
});