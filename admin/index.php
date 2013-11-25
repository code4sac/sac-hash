<?php
include('../data/140dev/db/cityTags_config.php');
include('../data/mysqli.php');
$mysql = new mysql();

$query = "
  SELECT  *
  FROM hashtag_suggestions
";
$rows = $mysql->getRows($query);

?>
<table border='1'>
<tr>
  <th>Hashtag</th>
  <th>Created date/time</th>
</tr>
<?php
$group_array = Array();
foreach($rows as $hts) {
  @$group_array[$hts->hashtag]++;
?>
  <tr>
    <td><?php echo $hts->hashtag; ?></td>
    <td><?php echo $hts->created_at; ?></td>
  </tr>
<?php
}
?>
</table>
<table border='1'>
<tr>
  <th>Hashtag</th>
  <th>Count</th>
</tr>
<?php
  foreach($group_array as $ht=> $cnt) {
?>
  <tr>
    <td><?php echo $ht;?></td>
    <td><?php echo $cnt;?></td>
  </tr>
<?php
  }
?>
</table>
