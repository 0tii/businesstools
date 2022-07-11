/*
 * File: request-body.ts
 * Project: bt-api
 * File Created: Monday, 4th July 2022 7:47:23 pm
 * Author: 0ti / Daniel Rauhut (daniel@rauhut.me)
 * -----
 * Last Modified: Monday, 4th July 2022 7:47:27 pm
 * Modified By: Daniel (you@you.you)
 * -----
 * Copyright 2022 - 2022 Daniel H. Rauhut, Rite Software
 */
import * as express from 'express';
import resolver from '../../resolver/resolver';

/**
 * 
 * @param limit 
 * @returns 
 */
export default function limitSize(limit: ScopeLimits | string) {
    console.log('Checking file size');
    return function (req: express.Request, res: express.Response, next: express.NextFunction) {//set specific limit if limit is a string
        if (typeof limit === 'string') {
            const limitBytes = interpretLimit(limit) || 100000; //set default 100kb if limit cant be evaluated
            if (req.socket.bytesRead > limitBytes)
                return resolver.error(`Request body size is ${req.socket.bytesRead / 1000000}mb and exceeds allowed limit of ${limitBytes / 1000000}mb`, 413, res);
            return next();
        }

        //if limit is not a string it must be of type ScopeLimits.
        //if user owns multiple scopes, the largest limit is used
        const scopes: string[] = <string[]>res.locals['user-scopes'];
        var currentLimit = 100000;
        for (const key in limit) {
            if (scopes.includes(key)) {
                let limitBytes = interpretLimit(limit[key]) || 0;
                if (limitBytes > currentLimit) currentLimit = limitBytes;
            }
        }
        console.log(`Request body size is ${req.socket.bytesRead / 1000000}mb and the allowed limit for your subscription is ${currentLimit / 1000000}mb`);
        if (req.socket.bytesRead > currentLimit)
            return resolver.error(`Request body size is ${req.socket.bytesRead / 1000000}mb and exceeds the allowed limit for your subscription (${currentLimit / 1000000}mb)`, 413, res);
        return next();
    }
}

/**
 * Tries interpreting a string file size and returns its value in bytes
 * @param limit the limit as a string in a format like ``'10mb'``
 * @returns the given limit in bytes or 0 if the limit string is malformed
 */
function interpretLimit(limit: string): number {
    if (limit.toLowerCase().endsWith('mb')) {
        return (parseFloat(limit.toLowerCase().split('mb')[0]) || 0) * 1000000;
    }
    if (limit.toLowerCase().endsWith('kb')) {
        return (parseFloat(limit.toLowerCase().split('kb')[0]) || 0) * 1000;
    }
    if (limit.toLowerCase().endsWith('b')) {
        return parseFloat(limit.toLowerCase().split('b')[0]) || 0;
    }
    return 0;
}

/**
 * Limits structure - basically a dictionary of scope and respective limit
 */
interface ScopeLimits {
    [scope: string]: string
}