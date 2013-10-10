define(['backbone','views/nbhood-view','hbs!tmpl/nbhoods-template'], function(Backbone, nbhoodsView, nbhoodsTemplate){
	'use strict';

	return Backbone.Marionette.CompositeView.extend({
		itemView: nbhoodsView,
		template: {
			type: 'handlebars',
			template: nbhoodsTemplate
		},
		onBeforeRender: function(){
			var countValues = [],
				collection = this.collection.models,
				colors = [
					['81.2', '94.1', '62'],
					['65.9', '85.9', '65.9'],
					['47.5', '74.1', '60.4'],
					['23.1', '52.5', '52.5'],
					['4.3', '28.2', '42']
				],
				min,
				max,
				diff,
				mapKey,
				scale,
				scaleDom = '';

			function generateColor(count, diff, min){

				var count = count,
					scale = count / max * 100;
					
				if (scale <= 20)
				color = colors[0]
				else if (scale <= 40)
				color = colors[1]
				else if (scale <= 60)
				color = colors[2]
				else if (scale <= 80)
				color = colors[3]
				else if (scale <= 100)
				color = colors[4]

				color = 'rgb(' + color.join('%,') + '%)';
				
				return color;	
			}

			function createScale(min, max, diff){
				var fifth = max * .2,
					ranges = [],
					finalRange = [];

				for (var i = 1; i <= 5; i++){
					var num = fifth * i;
						num = Math.round(num);
					ranges.push(num);

					if (i == 1)
					finalRange[0] = '0 - ' + (num-1);
					else if (i == 5)
					finalRange[4] = ranges[3] + ' - ' + max;
					else
					finalRange[i-1] = ranges[i-2] + ' - ' + (num-1);

				}
				
				return finalRange;
			}

			Array.minMax = function( array ){
    			max = Math.max.apply( Math, array ),
    			min = Math.min.apply( Math, array )
			};

			for (var i = 0; i < collection.length; i++){
				var count = collection[i].attributes.count;
				countValues.push(count)
			}

			Array.minMax( countValues );
			
			diff = Math.abs(min - max);

			for (var i = 0; i < collection.length; i++){
				var count = collection[i].attributes.count,
					poly = collection[i].attributes.poly,
					color = generateColor(count, diff, min);
					
				collection[i].set('color', color);
			}

			scale = createScale(min, max, diff);

			for (var i = 0; i < scale.length; i++){
				// console.log(colors[i])
				scaleDom = scaleDom + '<li style="background-color: rgb(' + colors[i].join('%,') + '%);">' + scale[i] + ' tweets</li>';
			}
			$('#block-view').before('<ul class="map-key">'+scaleDom+'</ul>')	
		}
	});
});