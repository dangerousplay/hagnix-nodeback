"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const User_1 = require("../models/User");
const constanst_1 = require("../config/constanst");
exports.TOKEN_COOKIE = 'token';
exports.AUTH_HEADER = 'authorization';
async function auth(req, res, next, callNext = true) {
    const cjwt = req.headers[exports.AUTH_HEADER];
    if (!cjwt) {
        res.sendStatus(401);
        return;
    }
    try {
        const user = jwt.verify(cjwt, constanst_1.JWTKEY);
        let userdb;
        if (!user.identifier)
            return res.status(400).send('Invalid token!');
        // language=RegExp
        if (user.identifier.match("([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})"))
            userdb = await User_1.User.findOne({ CPF: user.identifier }).select({ password: 1, roles: 1, admin: 1 });
        else
            userdb = await User_1.User.findOne({ email: user.identifier }).select({ password: 1, roles: 1, admin: 1 });
        if (!userdb)
            return res.status(400).send('Invalid token!');
        if (callNext)
            next();
        //@ts-ignore
        return userdb;
    }
    catch (e) {
        return res.status(400).send('Invalid token!');
    }
}
exports.auth = auth;
var Roles;
(function (Roles) {
    Roles["BAN_PLAYER"] = "BAN_PLAYER";
    Roles["KICK_PLAYER"] = "KICK_PLAYER";
    Roles["PARDON_PLAYER"] = "PARDON_PLAYER";
    Roles["GET_PLAYERS"] = "GET_PLAYERS";
    Roles["LOGGED_PLAYER"] = "LOGGED_PLAYER";
    Roles["AUTHORIZE_PLAYER"] = "AUTHORIZE_PLAYER";
})(Roles = exports.Roles || (exports.Roles = {}));
function getRoles() {
    return Object.keys(Roles);
}
exports.getRoles = getRoles;
class AuthBuilder {
    constructor() {
        this._roles = [];
        this._adminOnly = false;
    }
    addRole(value) {
        this._roles.push(value);
        return this;
    }
    setAdminOnly(value) {
        this._adminOnly = value;
        return this;
    }
    setRoles(value) {
        this._roles = value;
        return this;
    }
    get roles() {
        return this._roles;
    }
    get adminOnly() {
        return this._adminOnly;
    }
    build() {
        const __roles = this._roles;
        const __admin = this._adminOnly;
        //@ts-ignore
        return async function (req, res, next) {
            const userdb = await auth(req, res, next);
            if (!userdb)
                return;
            if (__roles.length > 0) {
                const roles = userdb.roles;
                const contains = roles.filter(P => __roles.indexOf(P.toUpperCase()) > -1).length;
                //@ts-ignore
                if (contains < 1)
                    return res.status(403).send('Not authorized');
            }
            if (__admin) {
                //@ts-ignore
                if (!userdb.admin)
                    return res.status(403).send('Not authorized');
            }
            return userdb;
        };
    }
}
exports.AuthBuilder = AuthBuilder;
