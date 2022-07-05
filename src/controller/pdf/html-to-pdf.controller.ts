/*
 * File: html-to-pdf.controller.ts
 * Project: bt-api
 * File Created: Friday, 1st July 2022 12:59:34 pm
 * Author: 0ti / Daniel Rauhut (daniel@rauhut.me)
 * -----
 * Last Modified: Friday, 1st July 2022 12:59:36 pm
 * Modified By: Daniel (you@you.you)
 * -----
 * Copyright 2022 - 2022 Daniel H. Rauhut, Rite Software
 */
import express from 'express';
import * as htmlPdf from 'better-html-pdf';
import resolver from '../../resolver/resolver';
import BaseController from '../base-controller';

class HtmlToPdfController extends BaseController {
    protected override async execute(req: express.Request, res: express.Response): Promise<void> {
        const html: string = req.body.html || '';
        const options: htmlPdf.PdfOptions = req.body.options || {};

        if (!html && !options.path) resolver.error('No conversion target given. Provide either html or options.url  parameters.', 422, res);

        //prepare api specific default options
        options['fileType'] = 'base64';
        options['timeout'] = 4000;

        try {
            resolver.resolve({ content: await htmlPdf.html2pdf(html, options) }, 200, res);
        } catch (err: any) {
            resolver.error('Conversion error.', 501, res);
        }
    }
}

export default HtmlToPdfController;