define(['backbone','store'], function( Backbone, store ){
	'use strict';

	return Backbone.Model.extend({
		initialize: function(){
			var watchedItems = store.get('watched');

			this.on('change:watched', function(){
				if ( watchedItems && watchedItems.indexOf(this.cid) < 0 ){
					watchedItems.push(this.cid)
				} else {
					watchedItems = [ this.cid ];
				}

				store.set('watched', watchedItems)
			});
		}
	});
});