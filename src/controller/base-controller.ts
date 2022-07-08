/*
 * File: base-controller.ts
 * Project: bt-api
 * File Created: Tuesday, 5th July 2022 1:40:22 pm
 * Author: 0ti / Daniel Rauhut (daniel@rauhut.me)
 * -----
 * Last Modified: Tuesday, 5th July 2022 1:40:26 pm
 * Modified By: Daniel (you@you.you)
 * -----
 * Copyright 2022 - 2022 Daniel H. Rauhut, Rite Software
 */
import * as express from 'express';
import resolver from '../resolver/resolver'

/**
 * Abstract controller class implements default permission check and exposes abstract execute function to handle endpoint-specific logic.
 */
abstract class BaseController {
    public scope: string;
    public endpoint: string;

    constructor(endpoint: string, scope: string) {
        this.scope = scope;
        this.endpoint = endpoint;
    }

    /**
     * Receive a request
     * @param req request object
     * @param res response objects
     */
    public receiver = async (req: express.Request, res: express.Response) => {

        try {
            this.verifyRequest(req, res)
        } catch (err: any) {
            return resolver.error(err.message, 401, res);
        }

        try {
            this.verifyBody(req);
        } catch (err: any) {
            return resolver.error(err.message, 422, res);
        }

        this.execute(req, res);
    }

    /**
     * Check if request owner has required scope for the action represented by this controller.
     */
    protected verifyRequest(req: express.Request, res: express.Response) {
        const scopes: string[] = <string[]>res.locals['user-scopes'] || [];
        if (!scopes.includes(this.scope))
            throw new Error('Unauthorized - your key does not have the permissions necessary for this endpoint.');
    }

    /**
     * Abstract method to verify request body. Must throw transparently worded exceptions if verification fails.\
     * *Example*:
     * ```js
     * if(isNaN(req.body.numerical)
     *   throw new Error('Parameter \'numerical\' is not a number.');
     * if(!req.body.requiredProperty)
     *   throw new Error('Parameter \'requiredProperty\' is required but does not exist.');
     * ```
     */
    protected abstract verifyBody(req: express.Request): Promise<void> | void;

    /**
     * Abstract method to implement the endpoints functionality.
     * @param req request object 
     * @param res response object
     */
    protected abstract execute(req: express.Request, res: express.Response): Promise<void> | void;
}

export default BaseController;