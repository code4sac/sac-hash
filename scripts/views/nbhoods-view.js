define(['backbone','communicator','views/nbhood-view','hbs!tmpl/nbhoods-template','collections/ranges-collection','views/ranges-view','jqueryui'], function(Backbone, Communicator, nbhoodsView, nbhoodsTemplate, rangesCollection, rangesView, jqueryui){
	'use strict';

	return Backbone.Marionette.CompositeView.extend({
		itemView: nbhoodsView,
		template: {
			type: 'handlebars',
			template: nbhoodsTemplate
		},
		events: {
			'click #sort-by li':'sort'
		},
		initialize: function(){
			
		},
		sort: function(e){
			var target = $(e.target).closest('li').attr('class'),
				nbhoods = this.$el.find('.nbhood');
			
			if (target == 'sort-high'){
				nbhoods.sort(function(a, b) {

					 // convert to integers from strings
					 a = parseInt($(a).attr('data-count'));
					 b = parseInt($(b).attr('data-count'));

					 // compare
					 if (a < b) {
					  return 1;
					 } else if (a > b) {
					  return -1;
					 } else {
					  return 0;
					 }
				});
				
				this.$el.append(nbhoods);
			} else if (target == 'sort-low'){
				nbhoods.sort(function(a, b) {

					 // convert to integers from strings
					 a = parseInt($(a).attr('data-count'));
					 b = parseInt($(b).attr('data-count'));

					 // compare
					 if (a > b) {
					  return 1;
					 } else if (a < b) {
					  return -1;
					 } else {
					  return 0;
					 }
				});
				
				this.$el.append(nbhoods);
			} else if (target == 'sort-a'){
				nbhoods.sort(function(a, b) {

					 // convert to integers from strings
					 a = $(a).attr('data-name');
					 b = $(b).attr('data-name');

					 // compare
					 if (a > b) {
					  return 1;
					 } else if (a < b) {
					  return -1;
					 } else {
					  return 0;
					 }
				});
				
				this.$el.append(nbhoods);
			} else if (target == 'sort-z'){
				nbhoods.sort(function(a, b) {

					 // convert to integers from strings
					 a = $(a).attr('data-name');
					 b = $(b).attr('data-name');

					 // compare
					 if (a < b) {
					  return 1;
					 } else if (a > b) {
					  return -1;
					 } else {
					  return 0;
					 }
				});
				
				this.$el.append(nbhoods);
			}
		},
		onBeforeRender: function(){

			var countValues = [],
				collection = this.collection.models,
				autocomplete = [],
				range,
				min,
				max,
				diff,
				mapKey,
				scale,
				scaleDom = '';

			// sets range on nbhood model to reference to ranges model later
			function generateColor(count, diff, min){

				var count = count,
					scale = count / max * 100;
					
				if (scale <= 20)
				range = 0;
				else if (scale <= 40)
				range = 1;
				else if (scale <= 60)
				range = 2;
				else if (scale <= 80)
				range = 3;
				else if (scale <= 100)
				range = 4;
				
				return range;	
			}

			// creates range scale and saves to ranges model
			function createScale(min, max, diff){
				var rangesLen = rangesCollection.length,
					singleRange = max * (1 / rangesLen),
					ranges = [],
					finalRange = [];

				for (var i = 1; i <= rangesLen; i++){
					var num = singleRange * i;
						num = Math.round(num);
					ranges.push(num);

					if (i == 1)
					rangesCollection.models[0].set('range', '0 - ' + ( num - 1));
					else if (i == rangesLen)
					rangesCollection.models[rangesLen - 1].set('range', ranges[rangesLen - 2] + ' - ' + max);
					else
					rangesCollection.models[i - 1].set('range', ranges[i - 2] + ' - ' + ( num - 1));
				}
			}


			// finds min and max values of all nbhood counts to create range
			Array.minMax = function( array ){
    			max = Math.max.apply( Math, array ),
    			min = Math.min.apply( Math, array )
			};

			for (var i = 0; i < collection.length; i++){
				var model = collection[i].attributes,
					count = model.COUNT,
					name = model.NAME2,
					hashtag = model.hashtag;

				autocomplete.push({
			        value: name,
			        label: name,
			        desc: hashtag
      			});

				countValues.push(count)
			}

			Array.minMax( countValues );
			
			diff = Math.abs(min - max);

			for (var i = 0; i < collection.length; i++){
				var count = collection[i].attributes.COUNT,
					poly = collection[i].attributes.poly,
					color = generateColor(count, diff, min);
					
				collection[i].set('range', range);
				collection[i].set('color', rangesCollection.models[range].get('color'));
			}

			scale = createScale(min, max, diff);

			this.collection.autocomplete = autocomplete;
			
		},
		onRender: function(){
			var data = this.collection.autocomplete,
				self = this,
				input = this.$el.find('#nbhood-search');
			
			input.autocomplete({
		    	minLength: 0,
		    	source: data,
		    	appendTo: "#sort-by .search",
    			select: function(event, ui){
    				var hashtag = ui.item.desc,
    					selectedModel = self.collection.find(function(model){
    						return model.get('hashtag') == hashtag;
    					});
    				Communicator.events.trigger('searchSelected', selectedModel);
    				
    				window.setTimeout(function(){
						input.val('');
					}, 100)
    			}
		  	});
		}
	});
});