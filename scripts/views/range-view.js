define(['backbone','hbs!tmpl/range-template'], function(Backbone, rangeTemp){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		tagName: 'li',
		template: rangeTemp,
		attributes: function(){
			return {
				style: 'background-color:'+this.model.get('color')+';'
			}
		}
	});
});