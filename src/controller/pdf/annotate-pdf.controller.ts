/*
 * File: annotate-pdf.controller.ts
 * Project: bt-api
 * File Created: Wednesday, 6th July 2022 12:01:54 pm
 * Author: 0ti / Daniel Rauhut (daniel@rauhut.me)
 * -----
 * Last Modified: Wednesday, 6th July 2022 12:01:58 pm
 * Modified By: Daniel (you@you.you)
 * -----
 * Copyright 2022 - 2022 Daniel H. Rauhut, Rite Software
 */

import BaseController from "../base-controller";
import * as express from 'express';
import * as pdf from 'pdf-lib';
import resolver from "../../resolver/resolver";
import fileConverter from "../../../lib/util/file/file-converter";
import { ColorTypes } from "pdf-lib";
import logger from "../../../lib/logger";


class AnnotatePdfController extends BaseController {

    protected async execute(req: express.Request, res: express.Response): Promise<void> {

        const fileContent: string = req.body.fileContent || '';
        if (!fileContent) return resolver.error('No pdf file content supplied.', 422, res);

        try {
            var fileBuffer = fileConverter.base64ToBufferSafe(fileContent);
        } catch {
            return resolver.error('Invalid file content. The file content provided is not valid base64.', 422, res);
        }

        //create document
        const document = await pdf.PDFDocument.load(fileBuffer);
        if (!document) return resolver.error('Invalid pdf file.', 422, res)

        //set font
        const userFont = await document.embedFont(getFont(req.body.font || ''));

        //check color option
        const rgb: number[] | undefined = readColorValues(req.body.color || '0,0,0,1');
        if (!rgb) return resolver.error('Malformed color option. Please make sure you specify the color as \'r,g,b[,a]\' where each value is either between 0 and 1 or between 0 and 255', 422, res);

        //get pages specified
        const pages = readPages(req.body.pages.toString() || '1');
        if (pages === undefined || pages.filter((pageNumber) => pageNumber < 0).length > 0) return resolver.error('Malformed pages option. Please only use either a comma separated list of page numbers, a page range(e.g. \'1-10\') or a single numerical value. Pages always start at 1.', 422, res);

        try {
            pages.forEach((pageNumber) => {
                const page = document.getPage(pageNumber);
                page.drawText(
                    req.body.text,
                    {
                        x: req.body.x || 0,
                        y: req.body.y || 0,
                        size: req.body.fontSize || 12,
                        font: userFont,
                        lineHeight: req.body.fontSize,
                        color: pdf.rgb(rgb[0], rgb[1], rgb[2]),
                        rotate: pdf.degrees(req.body.rotation || 0),
                        opacity: rgb[3] || 1
                    }
                );
            });
        } catch (err: any) {
            logger.error('[AnnotatePdf]'+err.message);
            return resolver.error('Server error while processing your document.', 501, res)
        }

        resolver.resolve(
            {
                fileContent: fileConverter.uInt8ArrayToBase64(await document.save())
            },
            200,
            res
        );
    }

    protected verifyBody(req: express.Request): void {
        if (!req.body.text)
            throw new Error('Required parameter \'text\' is missing.');

        if (req.body.x && typeof req.body.x === 'string')
            throw new Error('Parameter \'x\' must be a number.');

        if (req.body.y && typeof req.body.y === 'string')
            throw new Error('Parameter \'y\' must be a number.');

        if (req.body.fontSize && typeof req.body.fontSize === 'string')
            throw new Error('Parameter \'fontSize\' must be a number.');

        if (req.body.rotation && typeof req.body.rotation === 'string')
            throw new Error('Parameter \'rotation\' must be a number.');
    }
}

function readColorValues(rgba: string): number[] | undefined {
    try {
        const colorValues: number[] = rgba.split(',').map((num) => parseFloat(num.trim()));
        if (colorValues.length < 3) return undefined; //invalid color option

        //if only rgb was specified, push default alpha
        if (colorValues.length === 3) colorValues.push(1);

        colorValues.forEach((value) => {
            if (value >= 0 && value <= 1) return value;
            if (value < 0) return 0;
            if (value > 1) return value / 255;
        });
        return colorValues;
    } catch {
        return undefined;
    }
}

function getFont(name: string): pdf.StandardFonts {
    switch (name) {
        case '':
            return pdf.StandardFonts.Helvetica;
        case 'helvetica':
            return pdf.StandardFonts.Helvetica;
        case 'helvetica-bold':
            return pdf.StandardFonts.HelveticaBold;
        case 'helvetica-italic':
            return pdf.StandardFonts.HelveticaOblique;
        case 'courier':
            return pdf.StandardFonts.Courier;
        case 'courier-bold':
            return pdf.StandardFonts.CourierBold;
        case 'courier-italic':
            return pdf.StandardFonts.CourierOblique;
        case 'times-roman':
            return pdf.StandardFonts.TimesRoman;
        case 'times-roman-bold':
            return pdf.StandardFonts.TimesRomanBold;
        case 'times-roman-italic':
            return pdf.StandardFonts.TimesRomanItalic;
    }
    return pdf.StandardFonts.Helvetica;
}

function readPages(pages: string): number[] | undefined {
    //differentiate between number, list and range
    try {
        if (pages.includes(',')) {
            return pages.split(',').map((str) => parseInt(str.trim()) - 1);
        }

        if (pages.includes('-')) {
            const beginEnd: string[] = pages.split('-');
            var array = [];
            for (var i = parseInt(beginEnd[0].trim()) - 1; i <= parseInt(beginEnd[1].trim()) - 1; i++) {
                array.push(i);
            }
            return array;
        }

        return [parseInt(pages) - 1];
    } catch {
        return undefined;
    }
}

export default AnnotatePdfController;