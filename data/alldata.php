<?php
include('140dev/db/cityTags_config.php');
include('mysqli.php');
include('140dev/db/fusion_tables.php');
header('Content-type: application/json');

$ftable = new ftables('array');
$mysql  = new mysql();

$ft_query = "
  SELECT * 
  FROM ".$cityTags['fusion_table']." 
";
$tags     = $ftable->getRows($ft_query);
$json = array();
foreach($tags as $tag) {
  if($tag['hashtag'] == '') { continue; }
    $hashTag = $tag['hashtag'];
    $query = "SELECT count(tag) AS count FROM tweet_tags WHERE tag = '$hashTag'";
    $res = $mysql->getRows($query);
    $tag['COUNT'] = $res[0]->count;
    $json[] = $tag;
}
$json = json_encode($json, true);
print $json;
?>
