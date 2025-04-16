-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.8.3-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for arrangex
CREATE DATABASE IF NOT EXISTS `arrangex` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `arrangex`;

-- Dumping structure for table arrangex.admins
CREATE TABLE IF NOT EXISTS `admins` (
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `designation` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table arrangex.admins: ~0 rows (approximately)
INSERT INTO `admins` (`username`, `password`, `name`, `designation`) VALUES
	('admin', 'admin123', 'Tony', 'HOD');

-- Dumping structure for table arrangex.halls
CREATE TABLE IF NOT EXISTS `halls` (
  `name` varchar(50) DEFAULT NULL,
  `rows` int(11) DEFAULT NULL,
  `columns` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dumping data for table arrangex.halls: ~32 rows (approximately)
INSERT INTO `halls` (`name`, `rows`, `columns`) VALUES
	('CS1', 5, 6),
	('CS2', 5, 6),
	('CS3', 5, 6),
	('CS9', 5, 6),
	('CS5', 5, 6),
	('CS6', 5, 6),
	('CS7', 5, 6),
	('CS8', 5, 6),
	('CS4', 5, 6),
	('CS10', 5, 6),
	('EC1', 5, 6),
	('EC2', 5, 6),
	('EC3', 5, 6),
	('EC4', 5, 6),
	('EC5', 5, 6),
	('EC6', 5, 6),
	('EC7', 5, 6),
	('EC8', 5, 6),
	('CE1', 5, 6),
	('CE2', 5, 6),
	('CE3', 5, 6),
	('CE4', 5, 6),
	('EE1', 5, 6),
	('EE2', 5, 6),
	('EE3', 5, 6),
	('EE4', 5, 6),
	('ME1', 5, 6),
	('ME2', 5, 6),
	('ME3', 5, 6),
	('ME4', 5, 6),
	('ME-DH1', 5, 7),
	('ME-DH2', 8, 5);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
