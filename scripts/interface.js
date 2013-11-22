define(['backbone','communicator'], function(Backbone, Communicator){
	'use strict';

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
	
});