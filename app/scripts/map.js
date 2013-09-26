define([], function(){
    var center = new google.maps.LatLng(38.575067, -121.487761);

    var mapOptions = {
      center: center,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);

    return map;    
});