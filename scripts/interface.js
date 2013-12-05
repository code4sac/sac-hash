define(['backbone','communicator'], function(Backbone, Communicator){
	'use strict';

	// var interfaceTop = $('#tweet-feed').offset().top,
	// 	windowDom = $(window),
	// 	windowHeight = windowDom.height(),
	// 	nbhoodMenu = $('#nbhoods'),
	// 	tweetHeader = $('#tweet-feed'),
	// 	tweets = $('.tweet-container .isotope');

	$('#toggle-nav').on('click', function(event){
		var self = $(this);

		if (self.hasClass('nav-active')){
			$('.drop-down').animate({'right':'25px'}, 150).hide(0);
			self.removeClass('nav-active');
			self.find('div').removeClass('icon-remove').addClass('icon-reorder')

		} else {
			$('.drop-down').show(0).animate({'right':'35px','opacity':'1'}, 100);
			self.addClass('nav-active');
			self.find('div').removeClass('icon-reorder').addClass('icon-remove')
		}
		
	});

	window.setTimeout(function(){
		$('#welcome-modal').animate({ 'opacity':'1', 'margin-top':'0px' }, 100);
		$(document).on('click', '#map-canvas, #nbhoods, .toggle-search', function(){ $('#welcome-modal').hide(); });
	}, 1500)

	

	// windowDom.scroll(function(){
	// 	var scrollPos = windowDom.scrollTop();
		
	// 	if (scrollPos >= interfaceTop){
	// 		nbhoodMenu.css({'position':'fixed','top':'0px'});
	// 		tweetHeader.css({'position':'fixed','top':'0px','left':'25%'});
	// 		$('.tweet-container').attr('style','overflow: scroll; height:'+ (windowHeight - 40) +'px; position:relative;')
	// 	}
	// });
	
});