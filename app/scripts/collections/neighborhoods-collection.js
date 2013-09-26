define(['backbone', 'models/neighborhood-model'], function( Backbone, nbhoodModel){
	'use strict';

	var nbhoodCollection = Backbone.Collection.extend({
		model: nbhoodModel
	});

	return new nbhoodCollection([
		new nbhoodModel({
			nghood: 'Midtown',
			hashtag: '#MidTownSac'
		}),
		new nbhoodModel({
			nghood: 'Downtown',
			hashtag: '#DowntownSac'
		}),
		new nbhoodModel({
			nghood: 'Oldtown',
			hashtag: '#OldSac'
		}),
		new nbhoodModel({
			nghood: 'East Sacramento',
			hashtag: '#EastSac'
		}),
	]);
})