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
            "error": msg
        });
    }

    resolve(msg: Object, status: number, res: express.Response): void{
        res.status(status).send(msg);
    }
}
const resolver = new ErrorResolver();

export default resolver;