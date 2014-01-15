/* html request. My standard.
*   Emerge Framework
*/
var emerge = {
  // Define globals for emerge class
  debug: 1,

  /* == FUNCTIONS ========================================================== */

  /* AJAX GET
   * ======== */

  ajax_get: function(url, outDiv) {
    emerge.logger('AJAX->GET: '+url+' => '+outDiv);
	  var retVal;
    jQuery.ajax({
      url: url,
      type: 'GET',
      async: false,
      success: function(data, stat, jqXHR) {
        jQuery('#' + outDiv).empty();
     	  jQuery('#' + outDiv).html(data);
			  retVal = data;
      }
    });
	  return retVal;
  },

  /* AJAX POST
   * ========= */

  ajax_post: function(url, uri) {
    emerge.logger('AJAX->POST: '+url+'?'+uri);
    var retVal;
    jQuery.ajax({
      url: url,
      data: uri,
      type: 'POST',
      async: false,
      success: function(data, stat, jqXHR) {
        retVal = data;
      }
    });
    return retVal;
  },

  /* AJAX POST FORM
   * ============== */

  ajax_post_form: function(url, e) {
    var uri = encodeURI(jQuery('#'+e).serialize());
    emerge.logger('AJAX->FORM::POST: '+url+' - '+uri);
    var retVal;
    jQuery.ajax({
      url: url,
      data: uri,
      type: 'POST',
      async: false,
      success: function(data, stat, jqXHR) {
        retVal = data;
      }
    });
    return retVal;
  },

  reload_page: function(url) {
    jQuery.ajax({
      url: url,
      context: document.body,
      success: function(s,x) {
        jQuery(this).html(s);
      }
    });
  },

  /* Logger function
  *  =============== */
  logger: function(message) {
    if(emerge.debug == 1) {
      console.log(message);
    }
  }
} /* == END EMERGE ========================================================= */
