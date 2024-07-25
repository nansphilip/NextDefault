-- Creates a database
CREATE DATABASE `default-db`;

-- Selects the new database
USE `default-db`;

-- Creates an user and a password
CREATE USER 'default-user'@'localhost' IDENTIFIED BY 'default-password';

-- Allows user to connect to database
GRANT ALL PRIVILEGES ON *.* TO 'default-user'@'localhost';

