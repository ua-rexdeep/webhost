CREATE TABLE IF NOT EXISTS `web_files` (
  `id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `addedAt` bigint NOT NULL DEFAULT (0),
  `lastUsed` bigint NOT NULL DEFAULT (0),
  `type` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `size` int NOT NULL DEFAULT (0),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;