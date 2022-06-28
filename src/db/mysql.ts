/*
 * File: mysql.ts
 * Project: bt-api
 * File Created: Tuesday, 28th June 2022 12:52:01 pm
 * Author: 0ti / Daniel Rauhut (daniel@rauhut.me)
 * -----
 * Last Modified: Tuesday, 28th June 2022 12:52:06 pm
 * Modified By: Daniel (you@you.you)
 * -----
 * Copyright 2022 - 2022 Daniel H. Rauhut, Rite Software
*/
import mysql from 'mysql2';
import cfg from '../../cfg/config';
import credentials from '../../cfg/creds';

const pool = mysql.createPool({
        host: cfg.mysqlHost,
        port: cfg.mysqlPort,
        database: cfg.mysqlDbName,
        user: credentials.mysqlUser,
        password: credentials.mysqlPassword,
        connectionLimit: cfg.connectionLimit
    }
);

const promise = pool.promise();

export default promise;