define(['backbone','hbs!tmpl/tweet-template'], function(Backbone, tweetTemplate){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		className: 'tweet',
		template: tweetTemplate,
		onRender: function(){
			var avatar = this.$el.find('.avatar img');
			
			avatar.error(function(){
      			avatar.attr('src','styles/twitter-ico.png');
			});
		}
	});
});