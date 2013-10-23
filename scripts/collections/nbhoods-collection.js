define(['backbone','models/nbhood-model'], function( Backbone, nbhoodModel){
	'use strict';

	var nbhoodCollection = Backbone.Collection.extend({
		model: nbhoodModel,
		url: 'http://ec2-50-18-231-203.us-west-1.compute.amazonaws.com/server/twitterFeed/alldata.php',
		// parse: function(response) {
		// 	var result = [];

		// 	// for (var i = 0; i < response.length; i++){
		// 	// 	if (response[i].hashtag != ''){
		// 	// 		result.push(response[i])
		// 	// 	}
		// 	// }
		// 	console.log(true)
  //  			return response;
  //  			// return response;
  // 		},
  		parse: function(response) {
        return response.results;
    },

    sync: function(method, model, options) {
        var that = this;
        var params = _.extend({
            type: 'GET',
            dataType: 'jsonp',
            url: that.url,
            processData: false
        }, options);

        return $.ajax(params);
    }
	});

	var Neighborhoods = new nbhoodCollection();
	Neighborhoods.fetch({
        success: function() {
             console.log();
        },
        error: function() {
             console.log('Failed to fetch!');
        }
   });

	return Neighborhoods;
})