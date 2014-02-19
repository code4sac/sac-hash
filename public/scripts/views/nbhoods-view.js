define(['backbone','communicator','views/nbhood-view','hbs!tmpl/nbhoods-template','collections/ranges-collection','views/ranges-view','hbs!tmpl/modal-template', 'jqueryui/autocomplete','isotope'], function(Backbone, Communicator, nbhoodsView, nbhoodsTemplate, rangesCollection, rangesView, modalTemp){
	'use strict';

	return Backbone.Marionette.CompositeView.extend({
		itemView: nbhoodsView,
		template: {
			type: 'handlebars',
			template: nbhoodsTemplate
		},
		events: {
			'click #sort-by li':'sort',
			'click button#suggest-submit': 'submitSuggested'
		},
		initialize: function(){
			var self = this;
			rangesCollection.buildRanges();
			
			// trigger check if address search result is in neighborhood bounds
			Communicator.events.on('addressSearch', function( place ){
				self.addressSearch( place );
			});
		},
		addressSearch: function( place ){
			var result,
				resultModel = '',
				modalInfo = {
						place: place
				}
				
			this.collection.each(function(model){
				var polygon = model.get('poly'),
					contains = polygon.containsLatLng( place.geometry.location );
					console.log(contains)
				if (contains == true){
					result = true;
					resultModel = model;
				}
			});
			
			Communicator.events.trigger('searchSelected', resultModel);
			
			if (result){
				resultModel.get('infobox').setPosition( place.geometry.location );
			}
			
			if (!result){
			
				$('body').append( modalTemp(modalInfo) );
					
				$('.close-modal, #map-canvas, .nbhoods, .map-controls').on('click', function(){
					 $('#modal').remove();
				});
				
/* 				Communicator.events.trigger('clicked'); */
			} 
			
						
			
		},
		submitSuggested: function() {
			var sugtag = $('#suggest-field').val();
			$.ajax({
			      url: 'data/suggest.php',
			      //data: 'hashtag='+hashtag,
			      data: 'tags='+sugtag,
			      type: 'POST',
			      async: false,
			      success: function(data, stat, jqXHR) {
			        $('#suggest-field').val('');
			        $('#suggest-field').attr('placeholder', 'Thank you for the suggestion!');
			      }
			});
		},
		sort: function(e){
			var target = $(e.target).closest('li').attr('class'),
				nbhoods = this.$el.find('.nbhood');
			
			if (target == 'sort-high'){
				nbhoods.sort(function(a, b) {
					 a = parseInt($(a).attr('data-count'));
					 b = parseInt($(b).attr('data-count'));

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
					 a = parseInt($(a).attr('data-count'));
					 b = parseInt($(b).attr('data-count'));

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
					 a = $(a).attr('data-name');
					 b = $(b).attr('data-name');

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

					 a = $(a).attr('data-name');
					 b = $(b).attr('data-name');

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

			// sorts watched neighborhoods back to top of list
			this.sortWatched();
		},
		onBeforeRnder: function(){

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
					count = model.count,
					name = model.name,
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
					poly = collection[i].attributes.poly;
					generateColor(count, diff, min);
					
				if (!range)
				range = 0

				collection[i].set('range', range);
				collection[i].set('color', rangesCollection.models[range].get('color'));
			}

			scale = createScale(min, max, diff);

			this.collection.autocomplete = autocomplete;
			
		},
		createRanges: function(){
			var collection = this.collection.models,
				mean = 0,
				allCountValues = [],
				searchAutocomplete = [];

			// finds min and max values of all nbhood counts to create range
			Array.minMax = function( array ){
    			return {
    				max : Math.max.apply( Math, array ),
    				min : Math.min.apply( Math, array )
    			}
			};

			// populate array of all count values
			for (var i = 0; i < collection.length; i++){
				var model = collection[i].attributes,
					count = parseInt(model.count),
					name = model.name,
					hashtag = model.hashtag;

				searchAutocomplete.push({
			        value: name,
			        label: name,
			        desc: hashtag
      			});

				mean = mean + count;
				
				allCountValues.push(count)
			}

			allCountValues.sort(function(a,b){ return a-b });
			mean = mean / allCountValues.length;


			console.log(mean, allCountValues)
		},
		sortWatched: function(){
			this.$el.find('.watched').insertAfter( this.$el.find('#sort-by') );
		},
		onRender: function(){
			var self = this,
				autocompleteData = this.collection.autocomplete,
				input = this.$el.find('#nbhood-search');

			// brings watched neighborhoods to top of list
			this.sortWatched();

			// initialize neighborhood search autocomplete
			input.autocomplete({
		    	minLength: 0,
		    	source: autocompleteData,
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
