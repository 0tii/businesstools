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
import BasicScriptController from "./basic-script.controller";
import app from "./script.router";


export const scriptRoute = express.Router();

//initialize controllers
const basicScriptController = new BasicScriptController('/basic/:script', 'api.script.basic');


//initialize routes with their respective controllers
app.get(basicScriptController.endpoint, basicScriptController.receiver);