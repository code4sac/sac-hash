--
-- mysql_database_schema.sql
-- Schema for the 140dev Twitter framework MySQL database server
--
CREATE TABLE IF NOT EXISTS `hashtag_suggestions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hashtag` varchar(255) DEFAULT NULL COMMENT 'The hashtag suggested',
  `contact_handle` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;


CREATE TABLE IF NOT EXISTS `json_cache` (
  `tweet_id` bigint(20) unsigned NOT NULL,
  `cache_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cache_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `raw_tweet` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `parsed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`cache_id`),
  KEY `tweet_id` (`tweet_id`),
  KEY `cache_date` (`cache_date`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `tweets` (
  `tweet_id` bigint(20) unsigned NOT NULL,
  `tweet_text` varchar(160) NOT NULL,
  `entities` text NOT NULL,
  `created_at` datetime NOT NULL,
  `geo_lat` decimal(10,5) DEFAULT NULL,
  `geo_long` decimal(10,5) DEFAULT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `screen_name` char(20) NOT NULL,
  `name` varchar(40) DEFAULT NULL,
  `profile_image_url` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`tweet_id`),
  KEY `created_at` (`created_at`),
  KEY `user_id` (`user_id`),
  KEY `screen_name` (`screen_name`),
  KEY `name` (`name`),
  FULLTEXT KEY `tweet_text` (`tweet_text`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `tweet_mentions` (
  `tweet_id` bigint(20) NOT NULL,
  `source_user_id` bigint(20) NOT NULL,
  `target_user_id` bigint(20) NOT NULL,
  KEY `tweet_id` (`tweet_id`),
  KEY `source` (`source_user_id`),
  KEY `target` (`target_user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `tweet_tags` (
  `tweet_id` bigint(20) NOT NULL,
  `tag` varchar(100) NOT NULL,
  KEY `tweet_id` (`tweet_id`),
  KEY `tag` (`tag`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `tweet_urls` (
  `tweet_id` bigint(20) NOT NULL,
  `url` varchar(140) NOT NULL,
  KEY `tweet_id` (`tweet_id`),
  KEY `url` (`url`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` bigint(20) unsigned NOT NULL,
  `screen_name` varchar(20) NOT NULL,
  `name` varchar(40) DEFAULT NULL,
  `profile_image_url` varchar(200) DEFAULT NULL,
  `location` varchar(30) DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `followers_count` int(10) unsigned DEFAULT NULL,
  `friends_count` int(10) unsigned DEFAULT NULL,
  `statuses_count` int(10) unsigned DEFAULT NULL,
  `time_zone` varchar(40) DEFAULT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
     ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  KEY `user_name` (`name`),
  KEY `last_update` (`last_update`),
  KEY `screen_name` (`screen_name`),
  FULLTEXT KEY `description` (`description`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- Convert from UTF8 to UTF8MB4 to support Emoji
-- See also: http://mathiasbynens.be/notes/mysql-utf8mb4
ALTER DATABASE `sactags` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
ALTER TABLE `tweets` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `tweets` CHANGE `tweet_text` `tweet_text` VARCHAR(160) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
REPAIR TABLE `tweets`;
OPTIMIZE TABLE `tweets`;

-- Migrate un-prefixed tag values to prefixed
-- Migrate all tag values to lowercase
update tweet_tags set tag = '#westsac'     where tag in ('WestSac', 'westsac');
update tweet_tags set tag = '#midtownsac'  where tag in ('MidtownSac', 'midtownsac');
update tweet_tags set tag = '#downtownsac' where tag in ('DowntownSac', 'downtownsac');
update tweet_tags set tag = '#eastsac'     where tag in ('EastSac', 'eastsac');