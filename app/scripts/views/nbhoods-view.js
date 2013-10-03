define(['backbone','views/nbhood-view','hbs!tmpl/nbhoods-template'], function(Backbone, nbhoodsView, nbhoodsTemplate){
	'use strict';

	return Backbone.Marionette.CompositeView.extend({
		itemView: nbhoodsView,
		template: {
			type: 'handlebars',
			template: nbhoodsTemplate
		},

	});
});