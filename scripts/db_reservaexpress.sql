DROP DATABASE IF EXISTS db_reservaexpress;
CREATE DATABASE db_reservaexpress;
USE db_reservaexpress;

-- User Types Table
CREATE TABLE `tb_usertypes` (
    `usertype_id` INT AUTO_INCREMENT PRIMARY KEY,
    `description` VARCHAR(50) NOT NULL
);

INSERT INTO `tb_usertypes`
(`description`)
VALUES
('Administrador'),
('Afiliado'),
('Cliente');

-- Users Table
CREATE TABLE `tb_users` (
    `userid` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20),
    `gender` VARCHAR(1),
    `birthdate` DATE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
	`password_plain` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `creation_date` DATE,
    `usertype_id` INT,
	CONSTRAINT `fk_usertypes` FOREIGN KEY (`usertype_id`) REFERENCES `tb_usertypes`(`usertype_id`)
);

-- Restaurant Types Table
CREATE TABLE `tb_restauranttypes` (
    `restauranttype_id` INT AUTO_INCREMENT PRIMARY KEY,
    `description` VARCHAR(100) NOT NULL
);

-- Restaurants Table
CREATE TABLE `tb_restaurants` (
    `restaurant_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `address` VARCHAR(255) NOT NULL,
    `opening_hours` TIME,
    `closing_hours` TIME,
    `pax_limit` INT NOT NULL,
    `image_url` VARCHAR(255),
    `enable` VARCHAR(1) NOT NULL DEFAULT 'S',
    `restauranttype_id` INT,
    `userid` INT,
    `ruc` VARCHAR(11) NOT NULL,
    CONSTRAINT `fk_users` FOREIGN KEY (`userid`) REFERENCES `tb_users`(`userid`),
    CONSTRAINT `fk_restauranttypes` FOREIGN KEY (`restauranttype_id`) REFERENCES `tb_restauranttypes`(`restauranttype_id`)
);

-- Booking Status Table
CREATE TABLE `tb_bookingstatus` (
    `bookingstatusid` INT AUTO_INCREMENT PRIMARY KEY,
    `description` VARCHAR(100) NOT NULL
);

-- Bookings Table
CREATE TABLE `tb_bookings` (
    `booking_id` INT AUTO_INCREMENT PRIMARY KEY,
    `booking_date` DATE NOT NULL,
    `booking_time` TIME NOT NULL,
    `pax` INT NOT NULL,
    `restaurant_id` INT,
    `userid` INT,
    `bookingstatusid` INT,
    CONSTRAINT `fk_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `tb_restaurants`(`restaurant_id`),
    CONSTRAINT `fk_users_bookings` FOREIGN KEY (`userid`) REFERENCES `tb_users`(`userid`),
    CONSTRAINT `fk_bookingstatus` FOREIGN KEY (`bookingstatusid`) REFERENCES `tb_bookingstatus`(`bookingstatusid`)
);

-- Request Status Table
CREATE TABLE `tb_requeststatus` (
    `requeststatus_id` INT AUTO_INCREMENT PRIMARY KEY,
    `description` VARCHAR(100) NOT NULL
);

-- Affiliation Requests Table
CREATE TABLE `tb_affiliationrequests` (
	`request_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `address` VARCHAR(255) NOT NULL,
    `opening_hours` TIME,
    `closing_hours` TIME,
    `pax_limit` INT NOT NULL,
    `image_url` VARCHAR(255),
    `restauranttype_id` INT,
    `requeststatus_id` INT,
    `request_date` DATETIME,
	`userid` INT,
    `ruc` VARCHAR(11) NOT NULL,
    CONSTRAINT `fk_restauranttypes2` FOREIGN KEY (`restauranttype_id`) REFERENCES `tb_restauranttypes`(`restauranttype_id`),
	CONSTRAINT `fk_users_affiliation` FOREIGN KEY (`userid`) REFERENCES `tb_users`(`userid`),
    CONSTRAINT `fk_requeststatus` FOREIGN KEY (`requeststatus_id`) REFERENCES `tb_requeststatus`(`requeststatus_id`)
);

CREATE TABLE `tb_restaurantrequests` (
    `restaurantrequests_id` INT AUTO_INCREMENT PRIMARY KEY,
	`restaurant_id` INT,
	`name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `address` VARCHAR(255) NOT NULL,
    `opening_hours` TIME,
    `closing_hours` TIME,
    `pax_limit` INT NOT NULL,
    `image_url` VARCHAR(255),
    `restauranttype_id` INT,
    `requeststatus_id` INT,
    `request_date` DATETIME,
	`userid` INT,
    `ruc` VARCHAR(11) NOT NULL,
    CONSTRAINT `fk_restaurantid` FOREIGN KEY (`restaurant_id`) REFERENCES `tb_restaurants`(`restaurant_id`),
	CONSTRAINT `fk_restauranttypests` FOREIGN KEY (`restauranttype_id`) REFERENCES `tb_restauranttypes`(`restauranttype_id`),
	CONSTRAINT `fk_users_restaurantstatus` FOREIGN KEY (`userid`) REFERENCES `tb_users`(`userid`),
    CONSTRAINT `fk_res_requeststatus` FOREIGN KEY (`requeststatus_id`) REFERENCES `tb_requeststatus`(`requeststatus_id`)
);