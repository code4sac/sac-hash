# Sac-Tags

This application listens to the Twitter firehose streaming API, gathers data about specific hashtags and displays them on a map overlay similar to a heatmap, but using neighborhood geometry.

### Project discussion
https://trello.com/b/eMuHgAAN/sacramentohashtagproject

## Installing

###Data Component
1. Configure MySQL in data/140dev/db/cityTags_config.php

2. Load MySQL schema from data/140dev/db/mysql_database_schema.sql
   For Linux/Unix
   $ mysql -u USER -p -h localhost DATABASE < mysql_database_schema.sql

3. Add Google Fusion table API Key

4. Add Twitter API information

5. Configure DB_CONFIG_DIR, CODE_DIR in data/140dev/db/140dev_config.php to match your install directory.

### Git configuration
1. ```git submodule init```
2. ```git submoudle update```


