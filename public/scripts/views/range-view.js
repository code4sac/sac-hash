define(['backbone','hbs!tmpl/range-template'], function(Backbone, rangeTemp){
  'use strict';

  return Backbone.Marionette.ItemView.extend({
    tagName: 'li',
    template: rangeTemp,
    attributes: function(){
      return {
        style:  'border-top: 5px solid '+this.model.get('color')+';'
      }
    },
    onRender: function(){
      this.$el.find('.color-indicator').css('background-color', this.model.get('color'))
    }
  });
});