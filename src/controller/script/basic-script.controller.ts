import * as express from 'express';
import BaseController from "../base-controller";
import { VM } from 'vm2';
import resolver from '../../resolver/resolver';

class BasicScriptController extends BaseController {
    protected verifyBody(req: express.Request): void {
        console.log(req.params.script);
    }
    protected async execute(req: express.Request, res: express.Response): Promise<void> {
        const scriptString = req.params.script;
        if (!scriptString || typeof scriptString !== 'string') return resolver.error('Script string parameter is missing or malformed.', 422, res);

        try {
            const vm = new VM({
                timeout: 400,
                allowAsync: false,
                sandbox: {},
                eval: false,
                wasm: false
            });

            const result = vm.run(scriptString);

            resolver.resolve({ result: result }, 200, res);
        } catch {
            resolver.error('Error executing the script provided.', 501, res);
        }
    }
}

export default BasicScriptController;