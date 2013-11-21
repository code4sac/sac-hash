<?php
include('mysqli.php');
$mysql = new mysql();

$ht = filter_var($_POST['hashtag'], FILTER_SANITIZE_STRING);

$query = "
  INSERT INTO hashtag_suggestions
  VALUES('0', '$ht', '', now())
";

$mysql->insert($query);

?>
