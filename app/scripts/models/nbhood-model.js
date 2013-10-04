define(['backbone'], function( Backbone ){
	'use strict';

	return Backbone.Model.extend({
		initialize: function(){
			var count = Math.floor((Math.random()*136)+1);
			this.set('count', count);
		},
		url: '/neighborhoods',
		defaults: {
			name: '',
			hashtag: '',
			count: 0
		}
	});
});