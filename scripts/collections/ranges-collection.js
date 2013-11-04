define(['backbone', 'models/range-model'], function( Backbone, rangeModel){
	'use strict';

	var rangesCollection = Backbone.Collection.extend({
		model: rangeModel,
	});

	var Ranges = new rangesCollection([
		new rangeModel({ color: 'rgb(207,240,158)' }),
		new rangeModel({ color: 'rgb(168,219,168)' }),
		new rangeModel({ color: 'rgb(121,189,154)' }),
		new rangeModel({ color: 'rgb(59,134,134)' }),
		new rangeModel({ color: '#1B5D83' })
	]);

	return Ranges;
})