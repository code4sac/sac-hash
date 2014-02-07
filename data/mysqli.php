<?php // mysqli class
require_once('140dev/db/cityTags_config.php');
require_once('util.php');
class mysql {
	public $connection = NULL;
	
	// Constructor function
	function __construct($errors=false, $debug=false) {
		global $mysql_config;
		
		$this->connection = new mysqli (
			$mysql_config['host'],
			$mysql_config['user'],
			$mysql_config['pass'],
			$mysql_config['db']
		);
		$this->connection->set_charset('utf-8');
		if($this->connection->connect_errno) {
			print $this->connection->connect_error;
			$errMsg  = "ERROR (".$this->connection->connect_errno.") ";
			$errMsg .= $this->connection->connect_error;
			//logger($errMsg, 'mysql');
		}
	} // end __construct

	function getRows($query) {
		$type = 'object';
		preg_match('/from (?P<table>.*)/i', $query, $table);
		$tableName = $table['table'];
		$retArray = array();
		$rowCount	= 0;
		if($result = $this->connection->query($query)) {
			switch($type) {
				case 'assoc':		// Return associative array -------------------
					while($assoc = $result->fetch_assoc()) {
						$retArray[] = $assoc;
					}
					break;				// End return associative array --------------
				case 'object':	// Return Object
					while($obj = $result->fetch_object()) {
						$retArray[] = $obj;
					}
					break;				// End Return Objecta ------------------------
			}
			$result->close();
			//logger("getRows($tableName): ".sizeof($retArray)." rows returned", 'mysql');
			return $retArray;
		} else {
			// Result failed! Report Error!!
			$errMsg  = "ERROR (".$this->connection->errno.") ";
			$errMsg .= $this->connection->error;
			//logger($errMsg, 'mysql');	// Report to logfile
			jsError($errMsg);					// Critical. Report to javascript ALERT
			return;

		}
	} // End getRows

	function insert($query) {
		preg_match('/into (?P<table>.*).* values|\(/i', $query, $table);
		$tableName = $table['table'];
		if($result = $this->connection->query($query)) {
			//logger("Insert($tableName): id => ".$this->connection->insert_id, 'mysql');
			return $this->connection->insert_id;
		} else {
			$errMsg  = "ERROR (".$this->connection->errno.") ";
			$errMsg .= $this->connection->error;
			//logger($errMsg, 'mysql');	// Report to logfile
			jsError($errMsg);					// Critical. Report to javascript ALERT
			return;
		}
  }
	function update($query) {
		preg_match('/SET (?P<table>.*).* values|\(/i', $query, $table);
		$tableName = $table['table'];
		if($result = $this->connection->query($query)) {
			//logger("Update($tableName): affected rows => ".$this->connection->affected_rows, 'mysql');
			return $this->connection->affected_rows;
		} else {
			$errMsg  = "ERROR (".$this->connection->errno.") ";
			$errMsg .= $this->connection->error;
			//logger($errMsg, 'mysql');	// Report to logfile
			jsError($errMsg);					// Critical. Report to javascript ALERT
			return;
		}
  }
  function sanitizeArray($array) {
    $retArray = array();
    foreach($array as $key => $val) {
      $val = mysqli_real_escape_string($this->connection, $val);
    //  if($key == 'id') {
    //    if(!$var = filter_var($val, FILTER_VALIDATE_INT)) { return "FAIL"; }
    //  }
	  //logger("SANITIZE: ($key)", 'mysql');
      $retArray[$key] = $val;
    }
    return $retArray;
  }
}
