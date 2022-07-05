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
import { formatDate } from '../../../lib/util/date/DateUtility';

/**
 * Express middleware for bt key-authentication. Use the `key()` function to verify keys.
 * Keys have to be sent as `API-Key` request header.
 * 
 * Requires the database to be set up according to `/MySQL/setup.sql` and running.
 */
class Authentication {
    /**
     * Authenticates request by API-Key against the database. 
     * Rejects all unauthorized requests and attaches (or overwrites if exists) a header ``userScopes`` including all scopes assigned to the respective key. (//TODO)
     * Checks file size limit
     * @param req 
     * @param res 
     * @param next 
     */
    public authenticator = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        const key: string = req.get('API-Key') || '';
        if (!key) resolver.error('Unauthorized - no \'API-Key\' Header.', 401, res);

        //try to fetch dataset from databasse
        var row: RowDataPacket[] = [];
        try{
            row = await this.getKeyData(this.apiKeyHash(key));
        }catch{
            resolver.error('Server error while validating api key', 501, res);
        }

        if (row && row.length > 0) {
            if (this.keyExpired(row[0].valid_until)) {
                return resolver.error(`Unauthorized - API key expired on ${formatDate(new Date(row[0].valid_until), 'dd-MM-yyyy')}. Please renew your subscription.`, 401, res);
            }

            //scopes to array
            const scopes: string[] = row.map((row) => row.scope_name);

            if(!scopes || scopes.length < 1){
                return resolver.error('Unauthorized - Your API key is not assigned any permissions.', 401, res)
            }

            //attach user scopes to header and continue
            req.headers['user-scopes'] = scopes;

            next();
        } else {
            resolver.error('Unauthorized - invalid API Key.', 401, res);
        }
    }

    /**
     * Query expiry date and scopes for api-key
     * @param key sha256 hash of the key to query
     * @returns the dataset corresponding to the key or an empty dataset
     */
    private async getKeyData(key: string): Promise<RowDataPacket[]> {
        const [row] = await pool.query<RowDataPacket[]>(`
            SELECT k.valid_until, sc.scope_name FROM
            api_keys AS k
            INNER JOIN key_scopes AS ks
            ON k.id = ks.user_id
            INNER JOIN scopes AS sc
            ON ks.scope_id = sc.id
            WHERE k.key = ?;
        `, [key]);
        return row;
    }

    /**
     * 
     * 
     * @param str string to hash
     * @returns sha256 hash of `str` [encoded in b64] (tbd)
     */
    private apiKeyHash(str: string): string {
        return crypto.createHash('sha256').update(str).digest().toString('hex');
    }

    /**
     * Checks whether a key is expired by date. Basically wraps "is given datetime before now?"
     * @param date the expiry date of the key
     * @returns `true` if the key is expired, false if valid
     */
    private keyExpired(date: string): boolean {
        return new Date(date) < new Date();
    }
}

const auth = new Authentication();

export default auth;