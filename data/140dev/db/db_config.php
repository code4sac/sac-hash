<?php
/**
* db_config.php
* MySQL connection parameters for 140dev Twitter database server
* Fill in these values for your database
* Latest copy of this code: http://140dev.com/free-twitter-api-source-code-library/
* @author Adam Green <140dev@gmail.com>
* @license GNU Public License
* @version BETA 0.20
*/
require_once('cityTags_config.php');
global $mysql_config;

$db_host      = $mysql_config['host'];
$db_user      = $mysql_config['user'];
$db_password  = $mysql_config['pass'];
$db_name      = $mysql_config['db'];
?> 
