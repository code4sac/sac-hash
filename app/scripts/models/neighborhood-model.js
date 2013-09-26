define(['backbone'], function( Backbone ){
	'use strict';

	return Backbone.Model.extend({
		url: '/hashtags',
		defaults: {
			nbhood: '',
			hashtag: '',
			count: 0
		}
	});
});