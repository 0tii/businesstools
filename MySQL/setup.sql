/*
Setup script for BusinessTools API backend
*/

CREATE DATABASE IF NOT EXISTS bt;
USE bt;

DROP TABLE IF EXISTS api_keys;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    `uid` INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `verified` BOOLEAN DEFAULT false,
    `password` CHAR(60) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
    `2fa` BOOLEAN DEFAULT false,
    `created` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `altered` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_email ON users (email);

CREATE TABLE IF NOT EXISTS api_keys (
    `key` CHAR(100) PRIMARY KEY, /*encrypted*/
    `uid` INT NOT NULL,
    `valid_until` DATETIME,
    `created` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `altered` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `altered_by` VarChar(64),
    FOREIGN KEY (`uid`) REFERENCES users (`uid`)
);
CREATE INDEX IF NOT EXISTS idx_key ON api_keys (`key`);

/* Sample data */
INSERT INTO users(`email`, `password`) VALUES('daniel@rauhut.me', 'thiswillbeencryptedeventually');

INSERT INTO api_keys(`key`, `uid`) VALUES('MjFPxkzqF7xcnhj2cM0V3O3yhHqGpNSGCsfJF1DYm3o=', 1);
