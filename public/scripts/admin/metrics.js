!(function($, g) {
  'use strict';

  /**
   * Charting configuration
   */

  var chartReady = new $.Deferred,
      $el = $('.htp-chart-metrics'),
      options = {
        title: 'Tweets Gathered',
        curveType: 'function',
        hAxis: {
          textColor: '#fff'
        }
      };

  /**
   * ETL methods
   */

  function rowNormalizer(row) {
    return [row.timestamp, row.tweets];
  }

  /**
   * Chart implementation methods
   */

  function drawChart(e, deferreds) {
    var axes = [['time','tweets']],
        metrics = (deferreds[0]||[]).map(rowNormalizer),
        data = null,
        chart = new google.visualization.LineChart($el[0]);

    data = google.visualization.arrayToDataTable(axes.concat(metrics));

    chart.draw(data, options);
  }

  /**
   * Kick-off the charting
   */

  g.load('visualization', '1', {packages:['corechart']});
  g.setOnLoadCallback(chartReady.resolve);

  var dataReady = $.ajax({
    url : '/api/admin/metrics.json'
  });

  $.when(chartReady, dataReady).done(drawChart);

})(jQuery, google);
