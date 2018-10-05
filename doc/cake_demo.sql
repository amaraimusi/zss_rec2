-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 2018 年 5 朁E11 日 09:00
-- サーバのバージョン： 10.1.30-MariaDB
-- PHP Version: 7.1.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cake_demo`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `kanis`
--

CREATE TABLE `kanis` (
  `id` int(11) NOT NULL,
  `kani_val` int(11) DEFAULT NULL,
  `kani_name` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `kani_date` date DEFAULT NULL,
  `kani_group` int(11) DEFAULT NULL COMMENT '猫種別',
  `kani_dt` datetime DEFAULT NULL,
  `note` text CHARACTER SET utf8 NOT NULL COMMENT '備考',
  `delete_flg` tinyint(1) DEFAULT '0' COMMENT '無効フラグ',
  `update_user` varchar(50) CHARACTER SET utf8 DEFAULT NULL COMMENT '更新者',
  `ip_addr` varchar(40) CHARACTER SET utf8 DEFAULT NULL COMMENT 'IPアドレス',
  `created` datetime DEFAULT NULL COMMENT '生成日時',
  `modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータのダンプ `kanis`
--

INSERT INTO `kanis` (`id`, `kani_val`, `kani_name`, `kani_date`, `kani_group`, `kani_dt`, `note`, `delete_flg`, `update_user`, `ip_addr`, `created`, `modified`) VALUES
(1, 1, 'neko', '2014-04-01', 2, '2014-12-12 00:00:00', '', 0, 'test', '::1', NULL, '2015-11-16 21:45:38'),
(2, 25, 'kani5', '2014-04-03', 1, '2014-12-12 00:00:01', '', 0, 'test', '::1', NULL, '2015-12-01 19:36:33'),
(4, 4, 'buta', '2014-04-04', 2, '2014-12-12 00:00:03', 'AA\\r\\nBBB\\r\\n<input />', 0, 'kani', '::1', '2015-10-30 23:59:59', '2015-11-09 20:04:04'),
(5, 3, 'yagi', '2015-09-17', 2, '2014-12-12 00:00:02', '', 0, 'kani', '::1', '2015-10-31 00:00:00', '2015-11-09 20:03:40'),
(6, 3, 'ari', '2014-04-03', NULL, '2014-12-12 00:00:02', '', 0, NULL, NULL, NULL, '2015-09-15 22:40:01'),
(7, 3, 'tori', '2014-04-03', NULL, '2014-12-12 00:00:02', '', 1, 'kani', '::1', NULL, '2015-09-16 20:19:49'),
(8, 3, 'kame', '2014-04-03', NULL, '2014-12-12 00:00:02', '', 0, NULL, NULL, NULL, '2015-09-15 22:40:01'),
(9, 111, 'イッパイアッテナ', '2012-05-29', 3, '2014-04-28 10:04:00', 'いろは', 0, 'kani', '::1', NULL, '2015-09-16 11:56:07'),
(10, 123, 'PANDA', '1970-01-01', NULL, '2014-04-28 10:05:00', '', 0, NULL, NULL, NULL, '2015-09-15 22:40:01'),
(11, 123, 'るどるふ', NULL, 5, NULL, '', 0, 'kani', '::1', '2015-09-17 05:39:20', '2015-09-16 11:39:20');

-- --------------------------------------------------------

--
-- テーブルの構造 `nekos`
--

CREATE TABLE `nekos` (
  `id` int(11) NOT NULL,
  `neko_val` int(11) DEFAULT NULL,
  `neko_name` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `neko_date` date DEFAULT NULL,
  `neko_group` int(11) DEFAULT NULL COMMENT '猫種別',
  `neko_dt` datetime DEFAULT NULL,
  `note` text CHARACTER SET utf8 NOT NULL COMMENT '備考',
  `sort_no` int(11) DEFAULT '0' COMMENT '順番',
  `delete_flg` tinyint(1) DEFAULT '0' COMMENT '無効フラグ',
  `update_user` varchar(50) CHARACTER SET utf8 DEFAULT NULL COMMENT '更新者',
  `ip_addr` varchar(40) CHARACTER SET utf8 DEFAULT NULL COMMENT 'IPアドレス',
  `created` datetime DEFAULT NULL COMMENT '生成日時',
  `modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータのダンプ `nekos`
--

INSERT INTO `nekos` (`id`, `neko_val`, `neko_name`, `neko_date`, `neko_group`, `neko_dt`, `note`, `sort_no`, `delete_flg`, `update_user`, `ip_addr`, `created`, `modified`) VALUES
(1, 1, '\'\' = \'\'', '2014-04-01', 2, '2014-12-12 00:00:00', '大きな\n猫', 2, 0, 'kani', '::1', NULL, '2018-04-20 22:44:48'),
(2, 2000, '三毛A', '2014-04-02', 3, '2014-12-12 00:00:01', '', 11, 0, 'kani', '::1', NULL, '2018-03-20 03:05:46'),
(4, 4, 'buta', '2014-04-04', 0, '2014-12-12 00:00:03', '', 17, 0, 'kani', '::1', NULL, '2018-04-19 08:22:13'),
(5, 3, 'yagi', '2014-04-03', NULL, '2014-12-12 00:00:02', '', 14, 0, 'kani', '::1', NULL, '2018-03-20 03:05:46'),
(6, 3, 'ari', '2014-04-03', 2, '2014-12-12 00:00:02', '', 19, 0, 'kani', '::1', NULL, '2018-03-20 03:05:46'),
(7, 3, 'tori', '2014-04-03', NULL, '2014-12-12 00:00:02', '', 20, 0, 'kani', '::1', NULL, '2018-03-20 03:05:46'),
(8, 3, 'kame', '2014-04-03', 2, '2014-12-12 00:00:02', '', 21, 0, 'kani', '::1', NULL, '2018-03-20 03:05:46'),
(9, 111, 'ゴボウ', '1970-01-01', 2, '2014-04-28 10:04:00', '白菜とサラダセット', 22, 0, 'kani', '::1', NULL, '2018-03-20 03:06:17'),
(10, 123, 'PANDA', '1970-01-01', NULL, '2014-04-28 10:05:00', '', 18, 0, 'kani', '::1', NULL, '2018-03-20 03:05:46'),
(11, 3, 'kame', '2018-04-03', 0, '2014-12-12 00:00:02', '', 15, 0, 'kani', '::1', '2018-03-09 09:00:20', '2018-03-31 05:17:43'),
(17, 3, 'kame', '2014-04-03', 0, '2014-12-12 00:00:02', '', 12, 0, 'kani', '::1', '2018-03-20 06:39:26', '2018-03-20 03:05:46'),
(19, 111, 'aaa', NULL, 5, '2018-03-31 14:18:59', 'a', 13, 0, 'kani', '::1', '2018-03-20 06:41:48', '2018-03-31 05:18:31'),
(20, 3, 'kame2', '2014-04-03', NULL, '2014-12-12 00:00:02', '', 16, 0, 'kani', '::1', '2018-03-20 07:45:08', '2018-03-20 03:05:46'),
(21, 111, 'マヌタロウ', NULL, 3, NULL, 'あああ', 1, 1, 'kani', '::1', '2018-03-20 07:45:58', '2018-03-20 03:07:39'),
(22, 111, 'ハマダイコン', '1970-01-01', 2, '2014-04-29 10:04:00', '砂浜に生える大根', 23, 0, 'kani', '::1', '2018-03-30 09:46:18', '2018-03-30 00:46:18'),
(23, 3, 'AA', NULL, 1, NULL, '', 9, 1, 'kani', '::1', '2018-04-18 22:40:24', '2018-04-19 14:47:26'),
(24, 123, '', NULL, NULL, NULL, '', NULL, 1, 'kani', '::1', '2018-04-19 17:22:39', '2018-04-19 14:21:39'),
(25, 222, '', NULL, NULL, NULL, '', NULL, 1, 'kani', '::1', '2018-04-19 17:32:35', '2018-04-19 14:21:39'),
(26, 1, '', NULL, NULL, NULL, '', NULL, 0, 'kani', '::1', '2018-04-19 22:28:39', '2018-04-24 13:23:55'),
(28, NULL, 'AA', NULL, NULL, NULL, '', NULL, 0, 'kani', '::1', '2018-04-19 22:56:30', '2018-04-24 13:23:56'),
(29, NULL, 'A', NULL, NULL, NULL, '', NULL, 0, 'kani', '::1', '2018-04-19 22:57:16', '2018-04-24 13:24:01'),
(30, NULL, 'A', NULL, NULL, NULL, '', 1, 1, 'kani', '::1', '2018-04-19 23:21:05', '2018-04-19 14:21:39'),
(31, NULL, 'きゃとマスター', NULL, NULL, NULL, '', 1, 1, 'kani', '::1', '2018-04-19 23:23:06', '2018-04-19 14:25:55'),
(32, NULL, '猫マシーン', NULL, NULL, NULL, '', 1, 1, 'kani', '::1', '2018-04-19 23:24:14', '2018-04-19 14:25:55'),
(33, NULL, 'AAA', NULL, NULL, NULL, '', 1, 1, 'kani', '::1', '2018-04-19 23:25:20', '2018-04-19 14:25:55'),
(34, NULL, 'AS', NULL, NULL, NULL, '', 6, 1, 'kani', '::1', '2018-04-19 23:26:06', '2018-04-19 14:47:26'),
(35, NULL, 'A', NULL, NULL, NULL, '', 7, 1, 'kani', '::1', '2018-04-19 23:26:38', '2018-04-19 14:47:26'),
(36, NULL, 'AD', NULL, NULL, NULL, '', 8, 1, 'kani', '::1', '2018-04-19 23:26:56', '2018-04-19 14:47:26'),
(37, NULL, 'ロイヤルアナロスタン', NULL, NULL, NULL, '', 24, 0, 'kani', '::1', '2018-04-19 23:28:36', '2018-04-19 14:28:36'),
(38, NULL, 'ルガルガン', NULL, NULL, NULL, '', 25, 0, 'kani', '::1', '2018-04-19 23:31:42', '2018-04-19 14:31:42'),
(39, NULL, 'pokemon', NULL, NULL, NULL, '', 26, 0, 'kani', '::1', '2018-04-19 23:33:35', '2018-04-19 14:33:35'),
(40, NULL, 'bokemo', NULL, NULL, NULL, '', 27, 0, 'kani', '::1', '2018-04-19 23:34:50', '2018-04-19 14:34:50'),
(41, NULL, 'AFD', NULL, NULL, NULL, '', 28, 0, 'kani', '::1', '2018-04-19 23:36:30', '2018-04-19 14:36:31'),
(42, NULL, 'ヌガー', NULL, NULL, NULL, '', 10, 0, 'kani', '::1', '2018-04-19 23:37:50', '2018-04-19 14:37:50'),
(43, NULL, 'タヌキオジサン', NULL, 2, NULL, '', 9, 0, 'kani', '::1', '2018-04-19 23:38:45', '2018-04-19 14:38:45'),
(44, NULL, 'ライオン', NULL, NULL, NULL, '', 8, 0, 'kani', '::1', '2018-04-19 23:46:47', '2018-04-19 14:46:47'),
(45, NULL, 'バケオン', NULL, NULL, NULL, '', 7, 0, 'kani', '::1', '2018-04-19 23:46:57', '2018-04-19 14:46:57'),
(46, NULL, 'A', NULL, NULL, NULL, '', 6, 0, 'kani', '::1', '2018-04-20 07:28:28', '2018-04-19 22:28:28'),
(47, NULL, 'ビッグマスター', '2018-04-17', NULL, NULL, '', 5, 0, 'kani', '::1', '2018-04-20 07:28:43', '2018-04-24 00:53:57'),
(48, NULL, 'ブタヌキ', NULL, NULL, NULL, '', 3, 1, 'kani', '::1', '2018-04-20 07:30:14', '2018-04-24 13:17:05'),
(49, NULL, 'モウセン', NULL, NULL, NULL, '', 29, 0, 'kani', '::1', '2018-04-20 07:31:06', '2018-04-19 22:31:06'),
(50, NULL, 'TEST\\\'', NULL, 0, NULL, 'TEST\\nTEST2', 4, 0, 'kani', '::1', '2018-04-20 10:45:34', '2018-04-20 22:01:57'),
(51, NULL, 'TEST2', NULL, NULL, NULL, '', 30, 0, 'kani', '::1', '2018-04-20 10:46:21', '2018-04-20 01:46:21'),
(52, NULL, 'ツィッツァ', NULL, NULL, NULL, '', 1, 1, 'kani', '::1', '2018-04-20 11:12:09', '2018-04-24 13:06:05'),
(53, NULL, '<input />', NULL, 0, NULL, '', 0, 1, 'kani', '::1', '2018-04-22 15:07:23', '2018-04-24 13:17:01'),
(54, NULL, '<input />', NULL, NULL, NULL, '', -1, 1, 'kani', '::1', '2018-04-22 15:26:16', '2018-04-24 13:11:19'),
(55, 124, 'アカマムシ', NULL, 1, NULL, '', -2, 0, 'kani', '::1', '2018-04-24 07:06:22', '2018-04-23 22:06:22'),
(56, 1, '\'\' = \'\'', '2014-04-01', 2, '2014-12-12 00:00:00', '大きな\n猫', -3, 0, 'kani', '::1', '2018-04-24 13:56:44', '2018-04-24 04:56:44'),
(57, 1, '\'\' = \'\'', '2014-04-01', 2, '2014-12-12 00:00:00', '大きな\n猫', -4, 0, 'kani', '::1', '2018-04-24 13:58:23', '2018-04-24 04:58:23'),
(58, NULL, 'ああ', NULL, 1, NULL, '', -5, 1, 'kani', '::1', '2018-04-24 13:58:41', '2018-04-24 13:23:25'),
(59, 124, 'アカマムシ', NULL, 1, NULL, '', -2, 1, 'kani', '::1', '2018-04-24 14:01:31', '2018-04-24 13:12:45'),
(60, NULL, 'A', NULL, 1, NULL, '', -6, 0, 'kani', '::1', '2018-04-24 14:01:49', '2018-04-24 05:01:49'),
(61, 1233, 'ツィッツァ', NULL, NULL, NULL, '', 1, 1, 'kani', '::1', '2018-04-24 14:18:57', '2018-04-24 13:13:18'),
(62, NULL, 'タンタンタヌキ', NULL, 1, NULL, '', -7, 0, 'kani', '::1', '2018-04-24 14:19:09', '2018-04-24 05:19:09'),
(63, 300, 'ザ・ビッグ', NULL, 1, NULL, '', -8, 0, 'kani', '::1', '2018-04-26 06:46:01', '2018-04-25 21:46:01');

-- --------------------------------------------------------

--
-- テーブルの構造 `neko_groups`
--

CREATE TABLE `neko_groups` (
  `id` int(11) NOT NULL,
  `neko_group_name` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `sort_no` int(11) DEFAULT '0' COMMENT '順番',
  `delete_flg` tinyint(1) DEFAULT '0' COMMENT '無効フラグ',
  `update_user` varchar(50) CHARACTER SET utf8 DEFAULT NULL COMMENT '更新者',
  `ip_addr` varchar(40) CHARACTER SET utf8 DEFAULT NULL COMMENT 'IPアドレス',
  `created` datetime DEFAULT NULL COMMENT '生成日時',
  `modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータのダンプ `neko_groups`
--

INSERT INTO `neko_groups` (`id`, `neko_group_name`, `sort_no`, `delete_flg`, `update_user`, `ip_addr`, `created`, `modified`) VALUES
(1, 'ペルシャ', 0, 0, NULL, NULL, NULL, '2018-04-22 06:57:53'),
(2, 'ボンベイ', 0, 0, NULL, NULL, NULL, '2018-04-22 06:57:53'),
(3, '三毛', 0, 0, NULL, NULL, NULL, '2018-04-22 06:58:15'),
(4, 'シャム', 0, 0, NULL, NULL, NULL, '2018-04-22 06:58:15'),
(5, 'キジトラ', 0, 0, NULL, NULL, NULL, '2018-04-22 06:58:39'),
(6, 'スフィンクス', 0, 0, NULL, NULL, NULL, '2018-04-22 06:58:39'),
(7, 'メインクーン', 0, 0, NULL, NULL, NULL, '2018-04-22 06:59:21'),
(8, 'ベンガル', 0, 0, NULL, NULL, NULL, '2018-04-22 06:59:21');

-- --------------------------------------------------------

--
-- テーブルの構造 `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID',
  `username` varchar(50) DEFAULT NULL COMMENT 'ユーザー名',
  `password` varchar(50) DEFAULT NULL COMMENT 'パスワード',
  `role` varchar(20) DEFAULT NULL COMMENT '権限',
  `sort_no` int(11) DEFAULT '0' COMMENT '順番',
  `delete_flg` tinyint(4) DEFAULT '0' COMMENT '削除フラグ',
  `update_user` varchar(50) DEFAULT NULL COMMENT '更新ユーザー',
  `ip_addr` varchar(40) DEFAULT NULL COMMENT '更新IPアドレス',
  `created` datetime DEFAULT NULL COMMENT '作成日時',
  `modified` datetime DEFAULT NULL COMMENT '更新日時'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- テーブルのデータのダンプ `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `sort_no`, `delete_flg`, `update_user`, `ip_addr`, `created`, `modified`) VALUES
(1, 'yagi', 'f997247b8e456437055c20d681c3e7a15c5b6c35', 'oparator', 0, 0, 'kani', '::1', NULL, '2018-05-01 21:36:52'),
(2, 'buta', 'f84873b9689d4f255c8e0fe0ebcc4084bba12778', 'developer', 0, 0, 'kani', '::1', '2014-06-30 07:58:30', '2018-05-11 15:52:48'),
(3, 'kani', '10a4ef08902e5fa61ec06a003b48be8c526c08c3', 'master', 0, 0, 'buta', '::1', '2014-06-30 08:24:48', '2018-05-11 15:52:24'),
(4, 'kamakiri', 'e35a4768f8f60ceee01c96dbaef2217158aea2de', 'client', -1, 0, 'kani', '::1', '2018-05-01 21:38:35', '2018-05-01 21:38:35'),
(5, 'kame', 'f72ab3eb5cce6f6c7e69504c91b50de689772b0f', 'admin', -2, 0, 'kani', '::1', '2018-05-11 15:53:11', '2018-05-11 15:53:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kanis`
--
ALTER TABLE `kanis`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nekos`
--
ALTER TABLE `nekos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `neko_groups`
--
ALTER TABLE `neko_groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kanis`
--
ALTER TABLE `kanis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `nekos`
--
ALTER TABLE `nekos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `neko_groups`
--
ALTER TABLE `neko_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID', AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
