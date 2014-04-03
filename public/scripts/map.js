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
    }
  ];

  var mapOptions = {
    center: center,
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styles,
    disableDefaultUI: true,
  }

  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  return map;
});