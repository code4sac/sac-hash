define(['backbone','models/nbhood-model'], function( Backbone, nbhoodModel){
  'use strict';
  
 var proxiedSync = Backbone.sync;

  Backbone.sync = function(method, model, options) {
    options || (options = {});

    if (!options.crossDomain) {
      options.crossDomain = true;
    }

    if (!options.xhrFields) {
      options.xhrFields = {withCredentials:true};
    }

    return proxiedSync(method, model, options);
  };

  var nbhoodCollection = Backbone.Collection.extend({
    model: nbhoodModel,
    url: 'http://ec2-50-18-231-203.us-west-1.compute.amazonaws.com/data/alldata.php',
    // parse: function(response) {
    //  var result = [];

    //  // for (var i = 0; i < response.length; i++){
    //  //  if (response[i].hashtag != ''){
    //  //    result.push(response[i])
    //  //  }
    //  // }
    //  console.log(true)
  //        return response;
  //        // return response;
  //    },
 
    parse: function(response) {
      console.log(response.responseText)
      return response;
    },

    sync: function(method, model, options) {
        var that = this;
        var params = _.extend({
            type: 'GET',
            dataType: 'jsonp',
            url: that.url,
            processData: false,
        }, options);
        
        return $.ajax(params);
    }
  });



  var Neighborhoods = new nbhoodCollection([]);
    var onDataHandler = function(collection, response, options) {
      // console.log('membersview fetch onedatahandler');
      console.log('success', response)
  };

  var onErrorHandler = function(collection, response, options) {
      // console.log('membersview fetch onerrorhandler');
     
      console.log('error', response);
  };

  Neighborhoods.fetch({ success : onDataHandler, error: onErrorHandler, dataType: 'jsonp' });

  return Neighborhoods;
})