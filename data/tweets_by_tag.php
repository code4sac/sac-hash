<?php
include('140dev/db/cityTags_config.php');
include('mysqli.php');

header('Content-type: application/json');

$mysql  = new mysql();

$tag = filter_var($_GET['hashtag'], FILTER_SANITIZE_STRING);

$tag = "DowntownSac";

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
";

$result = $mysql->getRows($query);
$json   = json_encode($result, true);
print $json;
?>
