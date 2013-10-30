define(['communicator'], function( Communicator ){
    var center = new google.maps.LatLng(38.575067, -121.487761);
    var styles = [
  {
    "featureType": "road.local",
    "stylers": [
      { "weight": 0.9 },
      { "visibility": "simplified" },
      { "hue": "#ff5500" },
      { "lightness": 30 }
    ]
  },{
    "featureType": "transit.station",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "poi",
    "stylers": [
      { "visibility": "simplified" }
    ]
  },
  {
    "featureType": "poi.park",
    "stylers": [
      { "visibility": "simplified" },
      { "lightness": 35 },
      { "saturation": -45 }
    ]
  },
  {
    "featureType": "poi.school",
    "stylers": [
      { "visibility": "simplified" },
      { "lightness": 31 },
      { "saturation": -52 }
    ]
  },{
    "featureType": "administrative.neighborhood",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "water",
    "stylers": [
      { "visibility": "on" },
      { "hue": "#00aaff" },
      { "saturation": -66 }
    ]
  },{
    "featureType": "landscape",
    "stylers": [
      { "visibility": "on" },
      { "hue": "#ccff00" },
      { "saturation": 7 }
    ]
  },{
    "featureType": "road.highway",
    "stylers": [
      { "saturation": -50 },
      { "lightness": 35 },
      { "hue": '#ff6347' },
      { "weight": 0 },
      { "visibility": "simplified" }
    ]
  },{
  }
];
    var mapOptions = {
      center: center,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: styles,
      mapTypeControl: false,
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
    }
    
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    var defaultBounds = new google.maps.LatLngBounds(center, center);
    
    var input = document.getElementById('target');
    var searchBox = new google.maps.places.Autocomplete( input );
        searchBox.setBounds( defaultBounds );

    google.maps.event.addListener(searchBox, 'place_changed', function() {
      var place = searchBox.getPlace();

      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });

      Communicator.events.trigger('addressSearch', place);

    });

    
    return map;    
});