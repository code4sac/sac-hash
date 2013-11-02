define(['backbone','communicator'], function(Backbone, Communicator){
	'use strict';

	function toggleSearch(){
		var target = $('#toggle-search'),
			wrapper = target.closest('li'),
			panel = wrapper.find('#search-panel');

		if (target.hasClass('search-active')){
			wrapper.animate({'width':'44px'}, 150);
			target.removeClass('glyphicon-remove').addClass('glyphicon-search');
			panel.find('input').val('')
			panel.hide();

			target.removeClass('search-active');
		} else {
			wrapper.animate({'width':'500px'}, 100);
			target.removeClass('glyphicon-search').addClass('glyphicon-remove');
			panel.show();
			panel.find('input').focus();
			target.addClass('search-active');
		}
	}

	Communicator.events.on('closeSearchPanel', toggleSearch );

	$('#toggle-search').on('click', function(){
		toggleSearch();
	});

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