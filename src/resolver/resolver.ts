/*
 * File: error-resolver.ts
 * Project: bt-api
 * File Created: Tuesday, 28th June 2022 1:50:44 pm
 * Author: 0ti / Daniel Rauhut (daniel@rauhut.me)
 * -----
 * Last Modified: Tuesday, 28th June 2022 1:50:46 pm
 * Modified By: Daniel (you@you.you)
 * -----
 * Copyright 2022 - 2022 Daniel H. Rauhut, Rite Software
 */
import * as express from 'express';
class ErrorResolver{
    error(msg: string, status: number, res: express.Response): void{
        res.status(status).send({
            "error": msg,
            "request-id": res.locals['request-id']
        });
    }

    resolve(msg: Response, status: number, res: express.Response): void{
        msg['requestUID'] = res.locals['request-id'];
        res.status(status).send(msg);
    }
}

interface Response{
    [key: string]: any;
}

const resolver = new ErrorResolver();

export default resolver;