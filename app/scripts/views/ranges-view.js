define(['backbone','views/range-view','hbs!tmpl/ranges-template'], function(Backbone, rangeView, rangesTemp){
	'use strict';

	return Backbone.Marionette.CompositeView.extend({
		tagName: 'ul',
		className: 'map-key',
		template: rangesTemp,
		itemView: rangeView
	});
});