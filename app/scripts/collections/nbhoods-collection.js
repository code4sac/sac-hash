define(['backbone', 'models/nbhood-model'], function( Backbone, nbhoodModel){
	'use strict';

	var nbhoodCollection = Backbone.Collection.extend({
		model: nbhoodModel,
		url: '/neighborhoods',
		parse: function(response) {
			var result = [];
			for (var i = 0; i<response.length;i++){
				if (response[i].hashtag != '')
				result.push(response[i])
			}
   			return result;
  		}
	});

	var Neighborhoods = new nbhoodCollection();
	Neighborhoods.fetch({ });
	return Neighborhoods;
})