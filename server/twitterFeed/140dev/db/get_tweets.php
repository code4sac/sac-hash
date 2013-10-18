<?php
/**
* get_tweets.php
* Collect tweets from the Twitter streaming API
* This must be run as a continuous background process
* Latest copy of this code: http://140dev.com/free-twitter-api-source-code-library/
* @author Adam Green <140dev@gmail.com>
* @license GNU Public License
* @version BETA 0.20
*/
require_once('./140dev_config.php');
require_once('./fusion_tables.php');
require_once('./cityTags_config.php');

require_once(CODE_DIR . 'libraries/phirehose/Phirehose.php');
require_once(CODE_DIR . 'libraries/phirehose/OauthPhirehose.php');
class Consumer extends OauthPhirehose
{
  // A database connection is established at launch and kept open permanently
  public $oDB;
  public function db_connect() {
    require_once('./db_lib.php');
    $this->oDB = new db;
  }
	
  // This function is called automatically by the Phirehose class
  // when a new tweet is received with the JSON data in $status
  public function enqueueStatus($status) {
    $tweet_object = json_decode($status);
    $tweet_id = $tweet_object->id_str;

    // If there's a ", ', :, or ; in object elements, serialize() gets corrupted 
    // You should also use base64_encode() before saving this
    $raw_tweet = base64_encode(serialize($tweet_object));
		
    $field_values = 'raw_tweet = "' . $raw_tweet . '", ' .
      'tweet_id = ' . $tweet_id;
    $this->oDB->insert('json_cache',$field_values);
  }
}

// Open a persistent connection to the Twitter streaming API
$stream = new Consumer(OAUTH_TOKEN, OAUTH_SECRET, Phirehose::METHOD_FILTER);

// Establish a MySQL database connection
global $cityTags;
$ftable = new ftables('array');

$ft_query = "
  SELECT hashtag
  FROM ".$cityTags['fusion_table'];

$ht_array = array();
$rows = $ftable->getRows($ft_query);
foreach($rows as $row) {
  if(!empty($row['hashtag'])) {
    print "Loading: |".$row['hashtag']."|\n";;
    $ht_array[] = '#'.$row['hashtag'];
  }
}


$stream->db_connect();

// The keywords for tweet collection are entered here as an array
// More keywords can be added as array elements
// For example: array('recipe','food','cook','restaurant','great meal')
//$stream->setTrack(array('bonesnapper'));
$stream->setTrack($ht_array);

// Start collecting tweets
// Automatically call enqueueStatus($status) with each tweet's JSON data
$stream->consume();

?>
