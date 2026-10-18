-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: movie_booking
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booking_seats`
--

DROP TABLE IF EXISTS `booking_seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_seats` (
  `booking_id` int NOT NULL,
  `show_id` int NOT NULL,
  `seat_id` int NOT NULL,
  `ticket_price` decimal(38,2) DEFAULT NULL,
  PRIMARY KEY (`booking_id`,`seat_id`),
  UNIQUE KEY `show_id` (`show_id`,`seat_id`),
  KEY `seat_id` (`seat_id`),
  CONSTRAINT `booking_seats_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  CONSTRAINT `booking_seats_ibfk_2` FOREIGN KEY (`show_id`) REFERENCES `shows` (`show_id`),
  CONSTRAINT `booking_seats_ibfk_3` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`seat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_seats`
--

LOCK TABLES `booking_seats` WRITE;
/*!40000 ALTER TABLE `booking_seats` DISABLE KEYS */;
INSERT INTO `booking_seats` VALUES (1,1,2,200.00),(1,1,7,200.00),(1,1,8,200.00),(1,1,9,200.00),(2,1,3,200.00),(2,1,5,200.00),(3,3,1,220.00),(4,4,9,180.00),(5,3,9,220.00),(6,4,10,180.00),(7,3,3,220.00),(8,1,1,200.00),(9,3,2,220.00),(10,4,47,180.00),(11,1,47,200.00),(12,1,48,200.00),(13,3,8,220.00);
/*!40000 ALTER TABLE `booking_seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `show_id` int NOT NULL,
  `total_amount` decimal(38,2) DEFAULT NULL,
  `booking_status` varchar(255) DEFAULT NULL,
  `booked_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`booking_id`),
  KEY `user_id` (`user_id`),
  KEY `show_id` (`show_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`show_id`) REFERENCES `shows` (`show_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,2,1,800.00,'CONFIRMED','2026-10-17 05:38:53'),(2,2,1,400.00,'CONFIRMED','2026-10-17 07:11:27'),(3,2,3,220.00,'CONFIRMED','2026-10-17 07:12:17'),(4,3,4,180.00,'CONFIRMED','2026-10-17 09:36:28'),(5,4,3,220.00,'CONFIRMED','2026-10-17 12:21:21'),(6,4,4,180.00,'CONFIRMED','2026-10-17 12:33:41'),(7,4,3,220.00,'CONFIRMED','2026-10-17 12:37:45'),(8,4,1,200.00,'CONFIRMED','2026-10-17 12:45:11'),(9,3,3,220.00,'CONFIRMED','2026-10-17 15:20:09'),(10,4,4,180.00,'CONFIRMED','2026-10-18 05:25:02'),(11,4,1,200.00,'CONFIRMED','2026-10-18 05:29:23'),(12,4,1,200.00,'CONFIRMED','2026-10-18 05:29:38'),(13,4,3,220.00,'CONFIRMED','2026-10-18 05:40:00');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies` (
  `movie_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `genre` varchar(255) DEFAULT NULL,
  `duration_minutes` int DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `poster_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`movie_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movies`
--

LOCK TABLES `movies` WRITE;
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
INSERT INTO `movies` VALUES (1,'Leo','Sci-Fi',148,'English',NULL,NULL),(3,'Jailer','Sci-Fi',169,'English',NULL,NULL),(4,'Vikram','Animation',118,'English',NULL,NULL);
/*!40000 ALTER TABLE `movies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `seat_id` int NOT NULL AUTO_INCREMENT,
  `seat_number` varchar(255) DEFAULT NULL,
  `seat_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`seat_id`),
  UNIQUE KEY `seat_number` (`seat_number`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES (1,'A1','REGULAR'),(2,'A2','REGULAR'),(3,'A3','REGULAR'),(4,'A4','REGULAR'),(5,'A5','REGULAR'),(6,'B1','PREMIUM'),(7,'B2','PREMIUM'),(8,'B3','PREMIUM'),(9,'B4','PREMIUM'),(10,'B5','PREMIUM'),(43,'A6','REGULAR'),(44,'A7','REGULAR'),(45,'A8','REGULAR'),(46,'B6','REGULAR'),(47,'B7','REGULAR'),(48,'B8','REGULAR'),(49,'C1','REGULAR'),(50,'C2','REGULAR'),(51,'C3','REGULAR'),(52,'C4','REGULAR'),(53,'C5','REGULAR'),(54,'C6','REGULAR'),(55,'C7','REGULAR'),(56,'C8','REGULAR'),(57,'D1','REGULAR'),(58,'D2','REGULAR'),(59,'D3','REGULAR'),(60,'D4','REGULAR'),(61,'D5','REGULAR'),(62,'D6','REGULAR'),(63,'D7','REGULAR'),(64,'D8','REGULAR');
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shows`
--

DROP TABLE IF EXISTS `shows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shows` (
  `show_id` int NOT NULL AUTO_INCREMENT,
  `movie_id` int NOT NULL,
  `show_date` date NOT NULL,
  `show_time` time NOT NULL,
  `ticket_price` double DEFAULT NULL,
  PRIMARY KEY (`show_id`),
  KEY `movie_id` (`movie_id`),
  CONSTRAINT `shows_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shows`
--

LOCK TABLES `shows` WRITE;
/*!40000 ALTER TABLE `shows` DISABLE KEYS */;
INSERT INTO `shows` VALUES (1,1,'2026-10-20','10:00:00',200),(2,1,'2026-10-20','18:00:00',250),(3,3,'2026-10-20','14:00:00',220),(4,4,'2026-10-20','16:00:00',180);
/*!40000 ALTER TABLE `shows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test User','testuser101@example.com','$2a$10$u8pRThwuoIWvONXdsv/PD.rTNb3luaMEzrgWTMK.Mu9k5sNBtz0Eu','USER'),(2,'swathi','swa123@gmail.com','$2a$10$mBncIT2scgoswjPsvets0.EankWlgnjHW51mh10YsZ9A40Klnz8vW','USER'),(3,'Ravi','ravi123@gmail.com','$2a$10$KkbRGpo/Gm/jhmh5ESOrsuXn5Enzv3wHG0ArrEwNjpKTHDFm.NXne','USER'),(4,'Anitha','ani123@gmail.com','$2a$10$Xy4SoBOc3fRowCofTijm4e2.sS41RMiyWTEP1xKgoyThhFbxwBynm','USER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-18 11:30:48
