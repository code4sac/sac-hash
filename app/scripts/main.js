require([
	'backbone',
	'application',
	'pace'
],
function ( Backbone, App, pace ) {
    'use strict';

    pace.start({
    	querySelector: '#tweet-feed'
    });
    console.log(pace)
	App.start();
});
