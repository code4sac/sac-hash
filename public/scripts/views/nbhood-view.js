define(['backbone', 'communicator', 'store', 'hbs!tmpl/nbhood-template', 'map', 'geojson', 'hbs!tmpl/infobox-template', 'hbs!tmpl/tweet', 'collections/ranges-collection', 'collections/tweets-collection', 'isotope', 'infobox', 'polygonContains'], function(Backbone, Communicator, store, nbhoodTemplate, map, GeoJSON, infoboxTemp, tweetTemp, rangesCollection, tweetsCollection ){
  'use strict';

  var PolygonOptions = {
    strokeColor: '#000000',
    strokeOpacity: 0.2,
    strokeWeight: 1,
    fillOpacity: 0.8
  }

  return Backbone.Marionette.ItemView.extend({
    className: 'nbhood',

    template: {
      type: 'handlebars',
      template: nbhoodTemplate
    },

    events: {
      'click':'showTweets'
    },

    attributes: function(){
      return {
        'data-count': parseFloat(this.model.get('count')),
        'data-name': this.model.get('name'),
        'data-range': this.model.get('range')
      }
    },

    initialize: function(){
      // var watchedItems = store.get('watched');

      // checks local storage for watched neighborhoods
      // if ( watchedItems && watchedItems.indexOf(this.model.cid) > -1){
      //  this.model.set('watched', true);
      // }
    },

    onRender: function(){
      var self = this;

      $.ajax({
        url : '/api/geojsons/' + this.model.get('id') + '.geojson'
      })
      .done(this.createPolygon.bind(this))
      .done(this.infoBox.bind(this));

      // this.watched();

      // close open infobox when another is clicked
      Communicator.events.on('clicked', function(){
        self.model.get('infobox').close();
      });

      // trigger showTweets when neighborhood is selected from search autocomplete
      Communicator.events.on('searchSelected', function( model ){
        if (self.model.cid == model.cid){
          self.showTweets();
        } else {
          self.model.get('infobox').close();
        }
      });

      Communicator.events.on('zoom', function( zoom ){
        var ib = self.model.get('infobox');

        if (ib.getVisible() == true){
          zoom = (zoom * 4.6);
          ib.setOptions({ pixelOffset: new google.maps.Size(10, zoom * -1) });
          ib.draw();
        }
      });
    },

    watched: function(){
      if ( this.model.get('watched') == true ){
        this.$el.addClass('watched');
        this.$el.insertAfter( $('#sort-by') );
      }
    },

    showTweets: function( loc ){
      var self = this,
          keywords = this.model.get('keywords'),
          ib = this.model.get('infobox'),
          marker = this.model.get('marker'),
          center = this.model.get('center');

      if ($(window).scrollTop() > 0){

      } else {

      }

      // map.panTo( center );
      $('html, body').animate({'scrollTop':0}, 100, function(){
        map.panTo( center );
      });
      Communicator.events.trigger('clicked', keywords);

      ib.open(map, marker);

      if(loc && loc.geometry) {
        ib.setPosition( loc.geometry.location );
      }
    },

    createPolygon: function(geojson){
      var options = {
            fillColor:this.model.get('color')
          },
          features = new GeoJSON(geojson, $.extend(options, PolygonOptions));

      if(features.error) {
        return console.error(features.error);
      }

      var center;
      features.forEach(function(feature) {
        feature.setMap(map);
        if(feature.geojsonProperties) {
          this.model.set('outline', feature);
          center = this.GetCentroid(feature.getPath());
        }
      }.bind(this));

      this.model.set('features', features);
      this.model.set('center', center);
    },

    infoBox: function() {
      var outline = this.model.get('outline'),
          center = this.model.get('center'),
          self = this,
          marker,
          boxText,
          boxOptions,
          ib;

      marker = new google.maps.Marker({
        map: map,
        position: center,
        visible: false
      });

      boxOptions = {
         content: infoboxTemp(this.model.attributes)
        ,disableAutoPan: false
        ,maxWidth: 0
        ,pixelOffset: new google.maps.Size(15, -48)
        ,zIndex: null
        // ,closeBoxMargin: "10px 2px 2px 10px"
        ,closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
        ,infoBoxClearance: new google.maps.Size(0, 0)
        ,isHidden: false
        ,pane: "floatPane"
        ,enableEventPropagation: false
      };

      ib = new InfoBox(boxOptions);

      google.maps.event.addListener(outline, 'click', function() {
      var zoom = map.getZoom() * 4;
      ib.setOptions({ pixelOffset: new google.maps.Size(10, zoom * -1) });
        self.showTweets();
      });

      this.model.set('infobox', ib);
      this.model.set('marker', marker)
    },

    GetCentroid: function(paths){
      var f,
          x = 0,
          y = 0,
          nPts = paths.length,
          j = nPts-1,
          area = 0;

      for (var i = 0; i < nPts; j=i++) {
        var pt1 = paths.getAt(i),
            pt2 = paths.getAt(j);
        f = pt1.lat() * pt2.lng() - pt2.lat() * pt1.lng();
        x += (pt1.lat() + pt2.lat()) * f;
        y += (pt1.lng() + pt2.lng()) * f;

        area += pt1.lat() * pt2.lng();
        area -= pt1.lng() * pt2.lat();
      }
      area /= 2;
      f = area * 6;
      return new google.maps.LatLng(x/f, y/f);
    }
  });
});