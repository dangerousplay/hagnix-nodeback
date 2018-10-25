"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const app_1 = require("../app");
exports.router = express_1.Router();
exports.router.get('/', ((req, res, next) => {
    if (app_1.appHealth)
        res.sendStatus(200);
    else
        res.sendStatus(500);
}));
