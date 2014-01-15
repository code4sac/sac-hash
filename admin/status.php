<?php
include('../data/140dev/db/cityTags_config.php');
include('../data/mysqli.php');
$mysql = new mysql();

$query = "
    SELECT  count(*) as tweets
        ,   CONCAT(DATE(created_at), ' ', HOUR(created_at), ':00:00') as timestamp
    FROM tweets
    WHERE created_at BETWEEN NOW() - INTERVAL 7 DAY AND NOW()
    GROUP BY CONCAT(DATE(created_at), ' ', HOUR(created_at), ':00:00')
    ORDER BY created_at 
";
$rows = $mysql->getRows($query);
$data = "[['time', 'tweets'],";
foreach($rows as $row) {
    $data .= "['$row->timestamp', $row->tweets],";    
}
$data = preg_replace('/,$/', ']', $data);
print $data;
?>
    <script type="text/javascript">
        google.load("visualization", "1", {packages:["corechart"]});
        google.setOnLoadCallback(drawChart);
        function drawChart() {
            var data = google.visualization.arrayToDataTable(<?php echo $data;?>);
                                      
        var options = {
            title: 'Tweets Gathered',
            hAxis: {textColor: '#FFF'}
        };
                                                                    
        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
        }
    </script>
    <div id="chart_div" style="width: 100%; height: 500px;"></div>
  </body>
</html>
