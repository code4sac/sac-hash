define(['backbone','communicator','models/tweet-model','views/tweet-view','hbs!tmpl/tweets-template','hbs!tmpl/tweet','isotope'], function(Backbone, Communicator, tweetModel, tweetView, tweetsTemplate, tweetTemplate){
  'use strict';

  return Backbone.Marionette.CompositeView.extend({
    itemView: tweetView,
    template: {
      type: 'handlebars',
      template: tweetsTemplate
    },

    events: {
      'click .sort-tweets span':'sortDate'
    },

    ui: {
      container: '.tweet-container',
      currentHashtag: '.current-hashtag span',
      loader: '#loader'
    },

    initialize: function(){
      var self = this;

      Communicator.events.on('clicked', function( hashtag ){
        self.ui.currentHashtag.animate({'margin-top':'-40px'}, 150, function(){
          self.ui.currentHashtag.css('margin-top','40px').animate({'margin-top':'0'}, 150).text('#' + hashtag);
        });

        if (self.ui.container.hasClass('isotope'))
        self.ui.container.isotope('remove', self.$el.find('.tweet'));

        self.ui.loader.delay(200).fadeIn(200)
      });

      Communicator.events.on('autoLoad', function( tweets ){
        self.autoLoad( tweets );
      });

      this.collection.addTweets = [];
    },

    sortDate: function(e){
      var target = $(e.target),
          buttons = this.$el.find('.sort-tweets span');

      if (target.hasClass('active-sort')) return;
      else buttons.removeClass('active-sort');

      if (target.hasClass('date-new')){
        this.ui.container.isotope({
          sortBy : 'time',
          sortAscending : false
        });
        target.addClass('active-sort')
      }
      if (target.hasClass('date-old')){
        this.ui.container.isotope({
          sortBy : 'time',
          sortAscending : true
        });
        target.addClass('active-sort')
      }
    },

    onRender: function(){

    },

    appendHtml: function(collectionView, itemView, index){
      var container = this.ui.container,
          tweetWidth = Math.floor(container.width() / 3) - 10,
          tweet = itemView.$el.css('width', tweetWidth );

      // set tweet width for autoloaded tweets
      this.collection.tweetWidth = tweetWidth;

      container.isotope({
        itemSelector: '.tweet',
        masonry: {
          columnWidth: tweetWidth + 10,
          gutterWidth: 10,
          resizesContainer: true
        },
        getSortData : {
          time : function ( $elem ) {
            //return $elem.attr('data-time');
            return $elem.attr('data-id');
          }
        },
        sortBy : 'time',
        sortAscending : false
      });

      this.ui.loader.stop().hide();
      container.isotope( 'insert', tweet );
    },

    autoLoad: function( tweets ){
      var container = this.ui.container,
          tweetLen = tweets.length,
          newTweets = [];

      for (var i = 0; i < tweets.length; i++){
        var model = new tweetModel( tweets[i] ),
            view = new tweetView({ model: model }).render();

        view.$el.css('width', this.collection.tweetWidth );
        newTweets.push( view.el )
      }

      container.prepend( newTweets ).isotope( 'reloadItems' ).isotope({ sortBy: 'time' });
    }
  });
});