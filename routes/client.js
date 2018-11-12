"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const API_1 = require("../game/API");
const Auth_1 = require("../middleware/Auth");
const Joi = __importStar(require("joi"));
const Validation_1 = require("../middleware/Validation");
const constanst_1 = require("../config/constanst");
exports.router = express_1.Router();
const authAdmin = new Auth_1.AuthBuilder().setAdminOnly(true).build();
exports.router.get('/', Auth_1.auth, (req, res, next) => {
    res.send(API_1.clientApi.getOnlinePlayers());
});
exports.router.post('/kick', authAdmin, Validation_1.validateBody(validator), async (req, res, next) => {
    const result = await API_1.clientApi.kickPlayer(req.body.player, req.body.reason);
    if (result == 200) {
        res.send({ message: 'Player kicked sucessfully.' });
    }
    else {
        res.status(500).send({ message: 'Player not kicked.' });
    }
});
exports.router.get('/:email', Auth_1.auth, Validation_1.validateParams(validator), async (req, res, next) => {
    const player = await API_1.clientApi.getPlayer(req.params.email);
    if (!player)
        return res.status(404).send([]);
});
exports.router.post('/ban', authAdmin, Validation_1.validateBody(validator), async (req, res, next) => {
    const result = await API_1.clientApi.banPlayer(req.body.email);
    if (result == 200) {
        res.send('Player banned sucessfully.');
    }
    else {
        res.status(500).send({ message: 'Player not banned.' });
    }
});
exports.router.post('/pardon', authAdmin, Validation_1.validateBody(validator), async (req, res, next) => {
    const result = await API_1.clientApi.pardonPlayer(req.body.email);
    if (result == 200) {
        res.send('Player pardoned sucessfully.');
    }
    else {
        res.status(500).send({ message: 'Player not pardoned.' });
    }
});
exports.router.post('/authorize', authAdmin, Validation_1.validateBody(validator), async (req, res, next) => {
    const result = await API_1.clientApi.authorize(req.body.email, constanst_1.JWTTokenExpiration);
    if (result == 200) {
        res.send({ message: 'Player authorized sucessfully.' });
    }
    else {
        res.status(500).send({ message: 'Player not authorized.' });
    }
});
exports.router.get('/logged/:email', Auth_1.auth, Validation_1.validateParams(validator), async (req, res, next) => {
    const result = await API_1.clientApi.isLogged(req.params.email);
    if (result == 200) {
        res.send(result);
    }
    else {
        res.status(404).send({ message: 'Player not online.' });
    }
});
function validator(body) {
    return Joi.validate(body, Joi.object().keys({
        email: Joi.string().email().required()
    }));
}
