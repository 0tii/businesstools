/*
 * File: pdf.router.ts
 * Project: bt-api
 * File Created: Friday, 1st July 2022 12:49:24 pm
 * Author: 0ti / Daniel Rauhut (daniel@rauhut.me)
 * -----
 * Last Modified: Friday, 1st July 2022 12:51:30 pm
 * Modified By: Daniel (you@you.you)
 * -----
 * Copyright 2022 - 2022 Daniel H. Rauhut, Rite Software
 */

import express from "express";
import { pdfRoute } from './pdf.route';
import limiter from '../../middleware/body-limiter/body-limiter';

const app = express();

//custom per-scope body size limits
app.use(limiter({'api.pdf.basic': '2mb', 'api.pdf.full': '10mb'}));

app.use('/pdf', pdfRoute);

export default app;