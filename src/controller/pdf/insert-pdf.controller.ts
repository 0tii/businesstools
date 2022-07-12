/*
 * File: comment-pdf.controller.ts
 * Project: bt-api
 * File Created: Sunday, 10th July 2022 5:43:36 pm
 * Author: 0ti / Daniel Rauhut (daniel@rauhut.me)
 * -----
 * Last Modified: Sunday, 10th July 2022 5:44:20 pm
 * Modified By: Daniel (you@you.you)
 * -----
 * Copyright 2022 - 2022 Daniel H. Rauhut, Rite Software
 */

import * as express from 'express';
import BaseController from "../base-controller";
import pdflib, { PDFInvalidObjectParsingError } from 'pdf-lib';
import fileConverter from '../../../lib/util/file/file-converter';
import resolver from '../../resolver/resolver';
import { interpretNumbers } from '../../../lib/util/interpret/string-interpreter';

/**
 * Insert one pdf into another pdf at a specified index. Allows to insert either the full PDF file (if insertPages is unspecified) or a certain page / certain pages.
 * Req params:
 * - fileContent [base64 / required] - the main pdf file
 * - insertFileContent [base64 / required] - the file to insert from
 * - insertAt - [number] insert pages at this index (0 = before first page, 1= after first page)
 * - insertPages - [string] - specify a page, range or enumeration of pages from the inserted document as string (1-indexed -> first page == 1)
 */
class InsertPdfController extends BaseController {
    protected verifyBody(req: express.Request): void | Promise<void> {
        if (!req.body.insertAt)
            throw new Error('Required parameter \'insertAfter\' is not provided.');
        if (typeof req.body.insertAt !== 'number')
            throw new Error('Parameter \'insertAfter\' must be given as a number.');
    }
    protected async execute(req: express.Request, res: express.Response): Promise<void> {
        const fileContent: string = req.body.fileContent || '';
        if (!fileContent) return resolver.error('No pdf file content supplied.', 422, res);

        const insertFileContent: string = req.body.insertFileContent || '';
        if (!insertFileContent) return resolver.error('No insert pdf file content supplied.', 422, res);

        try {
            var fileBuffer: Buffer = fileConverter.base64ToBufferSafe(fileContent);
        } catch {
            return resolver.error('Invalid file content. The file content provided is not valid base64.', 422, res);
        }

        try {
            var insertFileBuffer: Buffer = fileConverter.base64ToBufferSafe(insertFileContent);
        } catch {
            return resolver.error('Invalid insert file content. The file content provided is not valid base64.', 422, res);
        }

        try {
            var insertDocument = await pdflib.PDFDocument.load(insertFileBuffer);
            var document = await pdflib.PDFDocument.load(fileBuffer);
        } catch {
            return resolver.error('Error reading PDF file content.', 501, res);
        }

        try {

            var insertAt = req.body.insertAt;

            if (req.body.insertPages !== undefined || req.body.insertPages === -1)
                var pages: pdflib.PDFPage[] = interpretNumbers(req.body.insertPages).map((num) => insertDocument.getPage(num));
            else
                var pages: pdflib.PDFPage[] = insertDocument.getPages();

            for (var i = 0; i < pages.length; i++) {
                document.insertPage(insertAt, pages[i]);
                insertAt++;
            }

            resolver.resolve({
                fileContent: fileConverter.uInt8ArrayToBase64(await document.save())
            }, 200, res);
        } catch {
            return resolver.error('Error processing your PDF Documents', 501, res);
        }
    }
}

export default InsertPdfController;