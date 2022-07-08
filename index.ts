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

import express from "express";
import https from 'https';
import cfg from './cfg/config';
import logger from "./lib/logger";
import auth from './src/middleware/auth/authenticate';
import bodyParser from "body-parser";
import helmet from "helmet";

import pdfRouter from "./src/controller/pdf/pdf.router";

const app = express();
app.disable('x-powered-by');

app.use(auth.validate);
app.use(helmet());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

//routes
app.use(pdfRouter);

//listen
https.createServer(
    {
        //certs
    },
    app
).listen(
    cfg.httpsPort,
    () => {
        logger.info(`[https server] listening on port ${cfg.httpsPort}.`);
    }
);

app.listen(
    cfg.httpPort,
    () => {
        logger.info(`[http server] listening on port ${cfg.httpPort}.\nPress Ctrl + C to exit.`);
    }
);

