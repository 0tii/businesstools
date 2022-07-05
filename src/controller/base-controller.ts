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
    public receive = async (req: express.Request, res: express.Response) => {
        if (!this.verifyRequest(req, res)) return;
        this.execute(req, res);
    }

    /**
     * Check if request owner has required scope for the action represented by this controller.
     */
    protected verifyRequest(req: express.Request, res: express.Response): boolean {
        const scopes: string[] = <string[]>req.headers['user-scopes'] || [];
        if (!scopes.includes(this.scope)) {
            resolver.error('Unauthorized - missing permission to access this endpoint. Please upgrade your license.', 401, res);
            return false;
        }
        return true;
    }

    /**
     * Abstract method to implement the endpoints functionality.
     * @param req request object 
     * @param res response object
     */
    protected abstract execute(req: express.Request, res: express.Response): Promise<void> | void;
}

export default BaseController;