define([], function(){
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
      { "saturation": -40 },
      { "lightness": 20 },
      { "hue": "#ff3c00" },
      { "weight": 2 },
      { "visibility": "simplified" }
    ]
  },{
  }
];
    var mapOptions = {
      center: center,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: styles
    }
    
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    
    return map;    
});