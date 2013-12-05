define(['backbone','hbs!tmpl/tweet-template'], function(Backbone, tweetTemplate){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		className: 'tweet',
		template: tweetTemplate,
		attributes: function(){
			return { 'data-time': this.model.get('time_stamp') }
		},
		onRender: function(){
			var avatar = this.$el.find('.avatar img');
			
			avatar.error(function(){
      			avatar.attr('src','assets/images/twitter-ico.png');
			});
		}
	});
});