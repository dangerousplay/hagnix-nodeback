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
const jwt = __importStar(require("jsonwebtoken"));
const constanst_1 = require("../config/constanst");
const bcrypt = __importStar(require("bcrypt"));
const joi = __importStar(require("joi"));
const Validation_1 = require("../middleware/Validation");
exports.router = express_1.Router();
exports.router.post('/', Validation_1.validateBody(validationResult), async (req, res, next) => {
    let userdb;
    // language=RegExp
    if (req.body.identifier.match("([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})"))
        //@ts-ignore
        userdb = await User_1.User.findOne({ CPF: req.body.identifier });
    else
        //@ts-ignore
        userdb = await User_1.User.findOne({ email: req.body.identifier });
    if (!userdb)
        return res.status(400).send('Bad credentials!');
    ;
    const epoch = Math.round(new Date().getTime() / 1000);
    //@ts-ignore
    const userAttempt = Math.round(userdb.login.lastAttempt.getTime() / 1000);
    if (userdb.login.locked) {
        if ((epoch - userAttempt) < 3600) {
            return res.status(403).send({
                message: `Your account is locked due to a multiple wrong password attempts.`,
                lastAttempt: userdb.login.lastAttempt
            });
        }
        else {
            userdb.login.attempts = 0;
        }
    }
    const equal = bcrypt.compareSync(req.body.password, userdb.password);
    if (!equal) {
        userdb.login.attempts++;
        userdb.login.lastAttempt = new Date();
        if (userdb.login.attempts > 5)
            userdb.login.locked = true;
        userdb.save();
        return res.status(400).send('Bad credentials!');
    }
    userdb.login.attempts = 0;
    userdb.login.lastAttempt = new Date();
    userdb.login.locked = false;
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
    res.cookie(Auth_1.TOKEN_COOKIE, jrToken, { secure: false, httpOnly: true });
    delete userdb.password;
    res.send({ token: jToken, user: userdb });
});
exports.router.post('/token', Validation_1.validateBody(validateIdentifier), async (req, res, next) => {
    const token = req.cookies[Auth_1.TOKEN_COOKIE];
    try {
        const user = jwt.verify(token, constanst_1.JWTKEY);
        let userdb;
        // language=RegExp
        if (req.body.identifier.match("([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})"))
            userdb = await User_1.User.findOne({ CPF: req.body.identifier });
        else
            userdb = await User_1.User.findOne({ email: req.body.identifier });
        if (!userdb) {
            return res.clearCookie(Auth_1.TOKEN_COOKIE).status(400).send('Invalid Token');
        }
        user.refreshToken = false;
        //@ts-ignore
        user.exp = new Date().getTime() + constanst_1.JWTTokenExpiration;
        delete userdb.password;
        res.send({ token: jwt.sign(user, constanst_1.JWTKEY), user: userdb });
    }
    catch (e) {
        res.sendStatus(400);
    }
});
exports.router.post('/revoke', ((req, res, next) => {
    const token = req.cookies[Auth_1.TOKEN_COOKIE];
    if (!token)
        return res.status(400).send('No cookie provided!');
    res.clearCookie(Auth_1.TOKEN_COOKIE);
}));
function validateIdentifier(body) {
    return joi.validate(body, joi.object().keys({
        identifier: joi.string().regex(new RegExp("([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})|" + constanst_1.EmailREGEX)),
    }));
}
function validationResult(body) {
    return joi.validate(body, joi.object().keys({
        identifier: joi.string().regex(new RegExp("([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})|" + constanst_1.EmailREGEX)),
        password: joi.string().min(8)
    }));
}
