/*
Setup script for BusinessTools API backend
*/

CREATE DATABASE IF NOT EXISTS bt;
USE bt;

DROP TABLE IF EXISTS key_scopes;
DROP TABLE IF EXISTS api_keys;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS scopes;

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
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `key` VarChar(64), /*SHA256 hashed*/
    `uid` INT NOT NULL,
    `valid_until` DATETIME,
    `created` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `altered` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `altered_by` VarChar(64),
    FOREIGN KEY (`uid`) REFERENCES users (`uid`)
);
CREATE INDEX IF NOT EXISTS idx_key ON api_keys (`key`);

/* API scopes */
CREATE TABLE IF NOT EXISTS scopes (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `scope_name` VarChar(32) NOT NULL UNIQUE 
);

/* API Keys and scopes */
CREATE TABLE IF NOT EXISTS key_scopes (
    `user_id` INT NOT NULL,
    `key_id` INT NOT NULL,
    `scope_id` INT NOT NULL,
    FOREIGN KEY (`key_id`) REFERENCES api_keys (`id`),
    FOREIGN KEY (`scope_id`) REFERENCES scopes (`id`)
);
CREATE INDEX idx_scope_userid ON key_scopes (`user_id`);

/* Sample data */
INSERT INTO users(`email`, `password`) VALUES('daniel@rauhut.me', 'hashed-salted-and-peppered'); --id: 1

INSERT INTO api_keys(`key`, `uid`, `valid_until`) VALUES('32314fc64cea17bc5c9e18f670cd15dcedf2847a86a4d4860ac7c91750d89b7a', 1, '2023-01-01 00:00:00'); --id: 1 / key: samplekeysamplekey
INSERT INTO api_keys(`key`, `uid`, `valid_until`) VALUES('ccdf94091ae1b30ca68db5f08d86b2594dfc8c4cb5f2f834e772aeffcd7c4ba2', 1, '2022-01-01 00:00:00'); --id: 1 / key: samplekeysamplekey

/* Sample scopes */
INSERT INTO scopes(`scope_name`) VALUES('api.pdf.basic'); --id: 1
INSERT INTO scopes(`scope_name`) VALUES('api.pdf.full'); --id: 2
INSERT INTO scopes(`scope_name`) VALUES('api.accounting'); --id: 3

/* Assign scopes to user keys */
INSERT INTO key_scopes(`user_id`, `key_id`, `scope_id`) VALUES(1, 1, 1);
INSERT INTO key_scopes(`user_id`, `key_id`, `scope_id`) VALUES(1, 1, 2);

SELECT k.valid_until, sc.scope_name FROM
api_keys AS k
INNER JOIN key_scopes AS ks
ON k.id = ks.user_id
INNER JOIN scopes AS sc
ON ks.scope_id = sc.id
WHERE k.key = '32314fc64cea17bc5c9e18f670cd15dcedf2847a86a4d4860ac7c91750d89b7a';