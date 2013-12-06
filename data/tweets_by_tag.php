<?php
include('140dev/db/cityTags_config.php');
include('mysqli.php');

header('Content-type: application/json');

$mysql  = new mysql();
$ntd    = NULL;
$otd    = NULL;
$WHERE  = NULL;

if(isset($_GET['ntd'])) {
  $ntd = $_GET['ntd'];
  $WHERE = "AND DATE(tweets.created_at) >= '$ntd'";
}

if(isset($_GET['otd'])) {
  $otd  = $_GET['otd'];
  $WHERE = "AND DATE(tweets.created_at) <= '$ntd'";
}

$tag = filter_var($_GET['hashtag'], FILTER_SANITIZE_STRING);

$query = "
SELECT  tweets.tweet_id
    ,   tweets.tweet_text
    ,   tweets.created_at
    ,   geo_lat
    ,   geo_long
    ,   user_id
    ,   screen_name
    ,   name
    ,   profile_image_url
FROM tweets
LEFT JOIN 
  tweet_tags ON tweet_tags.tweet_id = tweets.tweet_id
WHERE 
  tweet_tags.tag = '$tag'
  $WHERE
";

$result = $mysql->getRows($query);
$json   = json_encode($result, true);

print $json;
?>
