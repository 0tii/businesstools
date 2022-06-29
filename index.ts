/*
 * File: index.ts
 * Project: API
 * File Created: Tuesday, 28th June 2022 8:06:55 am
 * Author: 0ti / Daniel Rauhut (daniel@rauhut.me)
 * -----
 * Last Modified: Tuesday, 28th June 2022 8:24:07 am
 * Modified By: Daniel (you@you.you)
 * -----
 * Copyright 2022 - 2022 Daniel H. Rauhut, Rite Software
 */

/*
TODO: OCR [npm i tesseract]
*/
import express from "express";
import bodyParser from "body-parser";
import https from 'https';
import cfg from './cfg/config';
import auth from './src/middleware/auth/authenticate';

const server = express();

//middleware
server.use(auth.key);
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());


//route controllers

//listen
https.createServer(
    {

    },
    server
).listen(
    cfg.httpsPort,
    () => {
        console.log(`[https server] listening on port ${cfg.httpsPort}.`);
    }
);

server.listen(
    cfg.httpPort,
    () => {
        console.log(`[http server] listening on port ${cfg.httpPort}.`);
    }
);
