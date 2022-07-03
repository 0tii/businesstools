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
import auth from './src/middleware/auth/authenticate';

import pdfRouter from "./src/controller/pdf/pdf.router";

const app = express();

//middleware
app.use(auth.key);
app.use(express.json({limit: "10mb"})); //TODO custom limits per task

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
        console.log(`[https server] listening on port ${cfg.httpsPort}.`);
    }
);

app.listen(
    cfg.httpPort,
    () => {
        console.log(`[http server] listening on port ${cfg.httpPort}.`);
    }
);
