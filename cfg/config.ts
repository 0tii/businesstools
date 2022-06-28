/*
 * File: config.js
 * Project: bt-api
 * File Created: Tuesday, 28th June 2022 9:36:00 am
 * Author: 0ti / Daniel Rauhut (daniel@rauhut.me)
 * -----
 * Last Modified: Tuesday, 28th June 2022 9:39:53 am
 * Modified By: Daniel (you@you.you)
 * -----
 * Copyright 2022 - 2022 Daniel H. Rauhut, Rite Software
 */
export default {
    httpPort: 3000,
    httpsPort: 3443,
    mysqlHost: 'localhost',
    mysqlPort: 3306, //if 3306 does not work on linux, use '/var/run/mysqld/mysqld.sock'
    connectionLimit: 50,
    mysqlDbName: 'bt'
}