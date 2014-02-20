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
      return $('<tr><td>'+sugg.hashtag+'</td><td>'+sugg.created_at+'</td></tr>');
    });
    $suggestions.append(items);
  }

  function renderUniqueSuggestions(data) {
    var aggregates = data.reduce(function(groups, sugg) {
      groups[sugg.hashtag] = (groups[sugg.hashtag]||0) + 1;
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