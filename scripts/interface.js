define(['backbone','communicator'], function(Backbone, Communicator){
	'use strict';

	$('#toggle-nav').on('click', function(event){
		var self = $(this);

		if (self.hasClass('nav-active')){
			$('.drop-down').animate({'height':'10px'}, 100 , function(){
				$(this).animate({'width':'0'}, 70, function(){
					$(this).css({'top':'68px','opacity':'0','width':'200px','height':'auto'});
				});
			});
			self.removeClass('nav-active');
		} else {
			$('.drop-down').show(0).animate({'top':'62px','opacity':'1'}, 260);
			self.addClass('nav-active');
		}
		
	});
	
});