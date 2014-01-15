define(['backbone', 'models/range-model', 'collections/nbhoods-collection','geostats'], function( Backbone, rangeModel, nbhoodsCollection ){
	'use strict';

	var rangesCollection = Backbone.Collection.extend({
		model: rangeModel,
		buildRanges: function(){
			var self = this,
				data = [],
				serie,
				ranges;

			nbhoodsCollection.each(function(model){
				data.push( model.get('COUNT') )
			});
			
			data.push('30')
			data.push('5');
			
			serie = new geostats(data);
			serie.getJenks(5);
			ranges = serie.getRanges();

			for (var i = 0; i < this.models.length; i++){
				var model = this.models[i];
				
				model.set('range', ranges[i]); 
			}


			nbhoodsCollection.each(function(model){
				var inRange = serie.getRangeNum( model.get('COUNT') );
				model.set({'range': inRange, 'color': self.models[inRange].get('color')});
			});
		}
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
