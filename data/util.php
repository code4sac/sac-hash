<? // Utility functions: Dumper etc.
function Dumper($m, $title = '') {
  ?>
	<div class='dumper'>
	  <span><strong>Var Type: </strong><? print gettype($m); ?>&nbsp;<strong>Title: </strong> <?=$title;?></span>
		<pre>
	<? 
	if(is_array($m)) {
		print_r($m);
	} elseif(is_object($m)) {
		print "Dumping Object...\n";
		$class	= get_class($m);
		$methods = get_class_methods($m);
		foreach(get_object_vars($m) as $obVars) {
			print gettype($obVars)."\n";
		}
		print_r(get_object_vars($m));
	} else {
		print $m;
	}
	 ?>
	  </pre>
	</div>	
  <?
}

function extract_ft_id($url) {
  print $url;
  preg_match('/docid=(.*)/', urldecode($url), $match);
  return $match[1];
}

function logger($message, $class) {
	global $site_config;
	$log_handle = fopen("/log/".$class.".log", 'a');
	$date = Date('Y-m-d h:i:s');
	fwrite($log_handle, $date.':   '.$message."\n");
	fclose($log_handle);
}
function jsError($message) {
?><script type="text/javascript">
	alert("<?=$message; ?>");
</script><?
}
?>
