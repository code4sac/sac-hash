!(function($) {
  'use strict';

  /**
   * Rendering target configuration
   */

  var $suggestions = $('.htp-suggestions'),
      $unqiues = $('.htp-unique-suggestions');

  /**
   * Rendering/aggregation methods
   */

  function renderSuggestions(data) {
    var items = data.map(function(sugg) {
      var created_at = new Date(Date.parse(sugg.created_at));
      return $('<tr><td>'+sugg.keyword+'</td><td>'+created_at+'</td></tr>');
    });
    $suggestions.append(items);
  }

  function renderUniqueSuggestions(data) {
    var aggregates = data.reduce(function(groups, sugg) {
      groups[sugg.keyword] = (groups[sugg.keyword]||0) + 1;
      return groups;
    }, {});

    var items = Object.keys(aggregates).map(function(hashtag) {
      return $('<tr><td>'+hashtag+'</td><td>'+aggregates[hashtag]+'</td></tr>');
    });
    $unqiues.append(items);
  }

  /**
   * Kick-off the aggregating
   */

  $.ajax({
    url : '/api/admin/suggestions.json'
  })
  .done(renderSuggestions)
  .done(renderUniqueSuggestions)

})(jQuery);