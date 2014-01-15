<?php
include('../data/140dev/db/cityTags_config.php');
include('../data/mysqli.php');
?>
<html>
  <head>
    <script type="text/javascript" src="/components/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="/admin/js/emerge.js"></script>
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <link rel="stylesheet" href="/admin/css/main.css"></link>
  </head>
  <body>
  <div id="status"> </div>
  <div id="suggestions"> </div>
  </body>
  <script type="text/javascript">
        emerge.ajax_get('/admin/suggestions.php', 'suggestions');
        emerge.ajax_get('/admin/status.php', 'status');
  </script>
</html>
