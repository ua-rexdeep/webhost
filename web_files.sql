CREATE TABLE `web_files` (
  `id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `addedAt` bigint NOT NULL DEFAULT 0,
  `lastUsed` bigint NOT NULL DEFAULT 0,
  `type` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `size` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

/* migration to v2 */

ALTER TABLE web_files DROP name;
ALTER TABLE web_files ADD COLUMN category VARCHAR(64) DEFAULT NULL;

CREATE TABLE `web_categories` (
    `name` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`name`)
);
