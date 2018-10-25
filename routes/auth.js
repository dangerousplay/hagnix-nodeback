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
const User_1 = require("../models/User");
const Auth_1 = require("../middleware/Auth");
const Logger_1 = require("../init/Logger");
const jwt = __importStar(require("jsonwebtoken"));
const constanst_1 = require("../config/constanst");
const bcrypt = __importStar(require("bcrypt"));
const joi = __importStar(require("joi"));
const Validation_1 = require("../middleware/Validation");
exports.router = express_1.Router();
// language=RegExp
const identifier = /([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})/;
exports.router.post('/', Validation_1.validateBody(validationResult), async (req, res, next) => {
    let userdb;
    // language=RegExp
    if (req.body.identifier.match("([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})"))
        userdb = await User_1.User.findOne({ CPF: req.body.identifier }).select({ password: 1, admin: 1, roles: 1 });
    else
        userdb = await User_1.User.findOne({ email: req.body.identifier }).select({ password: 1, admin: 1, roles: 1 });
    if (!userdb)
        return res.status(400).send('Bad credentials!');
    const equal = bcrypt.compareSync(req.body.password, userdb.password);
    if (!equal)
        return res.status(400).send('Bad credentials!');
    const refreshToken = {
        identifier: req.body.identifier,
        admin: userdb.admin,
        roles: userdb.roles,
        refreshToken: true
    };
    const jrToken = jwt.sign(refreshToken, constanst_1.JWTKEY, { expiresIn: constanst_1.JWTRTokenExpiration });
    const jToken = jwt.sign({
        identifier: req.body.identifier,
        admin: userdb.admin,
        roles: userdb.roles,
        refreshToken: false
    }, constanst_1.JWTKEY, { expiresIn: constanst_1.JWTTokenExpiration });
    res.cookie(Auth_1.TOKEN_COOKIE, jrToken);
    res.send({ token: jToken });
});
//@ts-ignore
exports.router.get('/token', async (req, res, next) => {
    const token = req.cookies[Auth_1.TOKEN_COOKIE];
    try {
        const user = jwt.verify(token, constanst_1.JWTKEY);
        let userdb;
        // language=RegExp
        if (req.body.identifier.match("([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})"))
            userdb = await User_1.User.findOne({ CPF: req.body.identifier }).select({ password: 1, admin: 1, roles: 1 });
        else
            userdb = await User_1.User.findOne({ email: req.body.identifier }).select({ password: 1, admin: 1, roles: 1 });
        if (!userdb) {
            return res.clearCookie(Auth_1.TOKEN_COOKIE).status(400).send('Invalid Token');
        }
        user.refreshToken = false;
        user.exp = new Date().getTime() + constanst_1.JWTTokenExpiration;
        res.send({ token: jwt.sign(user, constanst_1.JWTKEY) });
    }
    catch (e) {
        Logger_1.error(e);
        res.sendStatus(400);
    }
});
exports.router.get('/revoke', ((req, res, next) => {
    const token = req.cookies[Auth_1.TOKEN_COOKIE];
    if (!token)
        return res.status(400).send('No cookie provided!');
    res.clearCookie(Auth_1.TOKEN_COOKIE);
}));
function validationResult(body) {
    return joi.validate(body, joi.object().keys({
        identifier: joi.string().regex(new RegExp("([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})|" + constanst_1.EmailREGEX)),
        password: joi.string().min(8)
    }));
}
