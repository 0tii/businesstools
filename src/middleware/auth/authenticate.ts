/*
 * File: authenticate.ts
 * Project: bt-api
 * File Created: Tuesday, 28th June 2022 1:13:30 pm
 * Author: 0ti / Daniel Rauhut (daniel@rauhut.me)
 * -----
 * Last Modified: Tuesday, 28th June 2022 1:18:00 pm
 * Modified By: Daniel (you@you.you)
 * -----
 * Copyright 2022 - 2022 Daniel H. Rauhut, Rite Software
 */
import * as express from 'express';
import { RowDataPacket } from 'mysql2';
import pool from '../../db/mysql';
import resolver from '../../resolver/resolver';
import crypto from 'crypto';
import { formatDate } from '../../util/date/DateUtility';

/**
 * Express middleware for bt key-authentication. Use the `.key()` function to verify keys.
 * Keys have to be sent as `API-Key` request header.
 * 
 * Requires the database to be set up according to `/MySQL/setup.sql` and running.
 */
class Authentication {
    /**
     * Authenticates request by API-Key against the database. Rejects all unauthorized requests.
     * @param req 
     * @param res 
     * @param next 
     */
    async key(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const key: string = req.get('API-Key') || '';
        if (!key) resolver.error('Unauthorized - no \'API-Key\' Header.', 401, res);

        //try to fetch dataset from databasse
        const row: RowDataPacket[] = await this._getKeyDataset(this._apiKeyHash(key));

        if (row && row.length > 0) {
            //separate condition for transparent error response
            if(this._keyExpired(row[0].valid_until)){
                resolver.error(`Unauthorized - API key expired on ${formatDate(new Date(row[0].valid_until), 'dd-MM-yyyy')}. Please renew your subscription.`, 401, res);
            }else{
                next();
            }
        } else {
            resolver.error('Unauthorized - invalid API Key.', 401, res);
        }
    }

    /**
     * Query a key from the database.
     * @param key sha256 hash of the key to query
     * @returns the dataset corresponding to the key or an empty dataset
     */
    async _getKeyDataset(key: string): Promise<RowDataPacket[]> {
        const [row] = await pool.query<RowDataPacket[]>('SELECT * FROM api_keys WHERE `key` = ?', [key]);
        return row;
    }

    /**
     * 
     * @param str string to hash
     * @returns sha256 hash of `str`
     */
    _apiKeyHash(str: string): string {
        return crypto.createHash('sha256').update(str).digest().toString('base64');
    }

    /**
     * Checks whether a key is expired by date. Basically wraps "is given datetime before now?"
     * @param date the expiry date of the key
     * @returns `true` if the key is expired, false if valid
     */
    _keyExpired(date: string): boolean {
        return new Date(date) < new Date();
    }
}

const auth = new Authentication();

export default auth;