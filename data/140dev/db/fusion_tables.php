<? /* Fusion Table Class
    * Returns json, or PHP array depending on how the class is
    * constructed. 'json' || 'array'
    */
require_once('cityTags_config.php');
class ftables {
  public $json;
  public $array;
  public $base_url;
  public $api_key;

  function __construct($type) {
    global $cityTags;
    $this->api_key = $cityTags['api_key'];
    $this->base_url = "https://www.googleapis.com/fusiontables/v1/";

    if($type == 'json') {
      $this->json   = 1;
      $this->arary  = 0;
    } else if($type == 'array') {
      $this->json   = 0;
      $this->array  = 1;
    }
  }
  /* getRows(query) - Returns php hash from SQL query
   * ================================================ */
  function getRows($query) {
    $key = $this->api_key;
    $base_url = "https://www.googleapis.com/fusiontables/v1/query";

    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_URL, $base_url);
    curl_setopt($ch, CURLOPT_POST, 'TRUE');
    curl_setopt($ch, CURLOPT_POSTFIELDS, "sql=".$query."&key=".$key);

    $json   = curl_exec($ch);

    /* Return JSON
        if this is true, function ends here.
     * ===================================== */
    if($this->json) {
      return $json;
    }

    $obj    = json_decode($json, true);

    $cols = $obj['columns'];

    $ret_array = array();

    foreach($obj['rows'] as $row) {
      $tArray = array();
      foreach($row as $key => $val) {
        $nKey = $cols[$key];
        $tArray[$nKey] = $val;
      }
      $ret_array[] = $tArray;
    }
    curl_close($ch);


    return $ret_array;
  }

  /* get_data(request) - class function to retreive data
   * =================================================== */
  function get_data($request) {
    $url = $this->base_url."tables/".$request."?key=".$this->api_key;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 20);

    $json = curl_exec($ch);
    return $json;

  }
  /* getStyles(table_id) - Returns all styles
   * ======================================== */
  function getStyles($table_id) {
    $ret = $this->get_data($table_id."/styles");
    if($this->array) {
      $ret = json_decode($ret, true);
      $ret = $ret['items'];
    }
    return $ret;
  }
  
  /* getOneStyle(table_id, style_number) - Returns single style
   * ========================================================== */
  function getOneStyle($table_id, $style) {
    $ret = $this->get_data($table_id."/styles/".$style);
    if($this->array) {
      $ret = json_decode($ret, true);
    }
    return $ret;
  }

  /* getColumns(table_id) - Returns all columns
   * ========================================== */
  function getColumns($table_id) {
    $ret = $this->get_data($table_id."/columns");
    if($this->array) {
      $ret = json_decode($ret, true);
      $ret = $ret['items'];
    }
    return $ret;
  }

  /* getOneColumn(table_id, col_id||col_name) - Returns single column BY id or name
   * ============================================================================== */
  function getOneColumn($table_id, $col) {
    /* Check if get by integer or string */
    if(is_int($col)) {
      // Is Integer
      $ret = $this->get_data($table_id."/columns/".$col);
      if($this->array) {
        $ret = json_decode($ret, true);
        $ret = $ret['items'];
      }
      return $ret;
    } else {
      // Is String
      $cols = $this->getColumns($table_id);
      $obj  = json_decode($cols, true);
      foreach($obj['items'] as $key => $val) {
        if($col == $val['name']) {
          $ret = $this->ret($val);
          if($this->json) {
            $ret = json_encode($ret, true);
          }
          return $ret;
        }
      }
    }
  }
} /* End Class */

