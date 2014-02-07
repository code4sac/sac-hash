define(['backbone','communicator'], function(Backbone, Communicator){
	'use strict';

	var interfaceTop = $('#tweet-feed').offset().top + 36,
		windowDom = $(window),
		windowHeight = windowDom.height(),
		nbhoodMenu = $('#nbhoods'),
		tweetHeader = $('.tweet-header'),
		tweets = $('.tweet-container .isotope');

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

	$(document).on('mouseenter', '.nbhood', function(){
		var index = $(this).index();
		$(this).find('.show-tweets').animate({'borderRightWidth':'5px'}, 100, function(){
			$(this).find('svg').animate({'right':'10px'}, 100);
		});
		if (index > 1)
		$(this).prev().css('border-bottom-color','white');
	});

	$(document).on('mouseleave', '.nbhood', function(){
		var index = $(this).index();
		$(this).find('.show-tweets').animate({'borderRightWidth':'0px'}, 150, function(){
			$(this).find('svg').animate({'right':'-30px'}, 150);
		});
		if (index > 1)
		$(this).prev().css('border-bottom-color','#e9e9e9');
	});

	windowDom.scroll(function(){
		var scrollPos = windowDom.scrollTop();
		
		if (scrollPos >= interfaceTop){
			nbhoodMenu.css({'position':'fixed','top':'0px'}, 100);
			$('.tweet-header').css({'position':'fixed','top':'0px','left':'25%','width':'75%','z-index':'500'});
			$('#tweet-feed').css({'position':'relative','left':'25%'})
		} else if (scrollPos <= interfaceTop ){
			nbhoodMenu.removeAttr('style')
			$('.tweet-header').removeAttr('style')
			$('#tweet-feed').removeAttr('style')
		}
	});
	
});