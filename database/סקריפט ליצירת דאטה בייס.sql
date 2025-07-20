CREATE DATABASE `software` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
CREATE TABLE `cards` (
  `CardId` int NOT NULL AUTO_INCREMENT,
  `CardName` varchar(50) NOT NULL,
  `CategoryId` int NOT NULL,
  PRIMARY KEY (`CardId`),
  KEY `CategoryId` (`CategoryId`),
  CONSTRAINT `cards_ibfk_1` FOREIGN KEY (`CategoryId`) REFERENCES `categories` (`CategoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `categories` (
  `CategoryId` int NOT NULL AUTO_INCREMENT,
  `CategoryName` varchar(50) NOT NULL,
  `CategoryClassification` int NOT NULL,
  PRIMARY KEY (`CategoryId`),
  KEY `CategoryClassification` (`CategoryClassification`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`CategoryClassification`) REFERENCES `classification` (`ClassificationId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `classification` (
  `ClassificationId` int NOT NULL AUTO_INCREMENT,
  `ClassificationName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ClassificationId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `customerinvoices` (
  `CustomerInvoiceId` int NOT NULL AUTO_INCREMENT,
  `CustomerId` int NOT NULL,
  `CardId` int NOT NULL,
  `CustomerInvoiceSum` float NOT NULL,
  `CustomerInvoiceDate` date NOT NULL,
  `CustomerInvoiceDetails` varchar(50) DEFAULT NULL,
  `CustomerInvoiceNumber` int DEFAULT NULL,
  PRIMARY KEY (`CustomerInvoiceId`),
  KEY `CustomerId` (`CustomerId`),
  KEY `CardId` (`CardId`),
  CONSTRAINT `customerinvoices_ibfk_1` FOREIGN KEY (`CustomerId`) REFERENCES `customers` (`CustomerId`),
  CONSTRAINT `customerinvoices_ibfk_2` FOREIGN KEY (`CardId`) REFERENCES `cards` (`CardId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `customers` (
  `CustomerId` int NOT NULL AUTO_INCREMENT,
  `CustomerName` varchar(50) DEFAULT NULL,
  `CustomerPhoneNumber` varchar(25) DEFAULT NULL,
  `CustomerAddress` varchar(50) DEFAULT NULL,
  `CustomerEmail` varchar(50) DEFAULT NULL,
  `CustomerContactName` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`CustomerId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `providerinvoices` (
  `ProviderInvoiceId` int NOT NULL AUTO_INCREMENT,
  `ProviderId` int NOT NULL,
  `CardId` int NOT NULL,
  `ProviderInvoiceSum` float NOT NULL,
  `ProviderInvoiceDate` date NOT NULL,
  `ProviderInvoiceDetails` varchar(50) DEFAULT NULL,
  `ProviderInvoiceNumber` int DEFAULT NULL,
  PRIMARY KEY (`ProviderInvoiceId`),
  KEY `ProviderId` (`ProviderId`),
  KEY `CardId` (`CardId`),
  CONSTRAINT `providerinvoices_ibfk_1` FOREIGN KEY (`ProviderId`) REFERENCES `providers` (`ProviderId`),
  CONSTRAINT `providerinvoices_ibfk_2` FOREIGN KEY (`CardId`) REFERENCES `cards` (`CardId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `providers` (
  `ProviderId` int NOT NULL AUTO_INCREMENT,
  `ProviderName` varchar(50) DEFAULT NULL,
  `ProviderPhoneNumber` varchar(25) DEFAULT NULL,
  `ProviderAddress` varchar(50) DEFAULT NULL,
  `ProviderEmail` varchar(50) DEFAULT NULL,
  `ProviderContactName` varchar(25) DEFAULT NULL,
  `ProviderCompanyNumber` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`ProviderId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
