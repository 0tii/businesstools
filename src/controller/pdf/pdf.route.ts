/*
 * File: pdf.controller.ts
 * Project: bt-api
 * File Created: Friday, 1st July 2022 12:55:18 pm
 * Author: 0ti / Daniel Rauhut (daniel@rauhut.me)
 * -----
 * Last Modified: Friday, 1st July 2022 12:55:22 pm
 * Modified By: Daniel (you@you.you)
 * -----
 * Copyright 2022 - 2022 Daniel H. Rauhut, Rite Software
 */

import express from "express";
import HtmlToPdfController from "./html-to-pdf.controller";

export const pdfRoute = express.Router();

//initialize controllers
const htmlToPdf = new HtmlToPdfController('/html-to-pdf', 'api.pdf.full');

pdfRoute.post(htmlToPdf.endpoint, htmlToPdf.receive);