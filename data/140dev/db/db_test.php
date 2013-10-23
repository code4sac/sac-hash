<?php 
/**
* db_test.php
* Use this script to test your database installation 
* 
* Latest copy of this code: http://140dev.com/free-twitter-api-source-code-library/
* @author Adam Green <140dev@gmail.com>
* @license GNU Public License
* @version BETA 0.20
*/
require_once('./140dev_config.php');
require_once('./db_lib.php');
$oDB = new db;
print "Twitter Database Tables\n";
$result = $oDB->select('SHOW TABLES');
while ($row = mysqli_fetch_row($result)) {
  $res = $oDB->select("SELECT count(*) AS CNT FROM $row[0]");
  $rows = mysqli_fetch_row($res);
  printf("%-25s", $row[0]);
  print "Rows($rows[0])\n";
}
?>
