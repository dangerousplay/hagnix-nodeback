import * as jwt from "jsonwebtoken";
import {User, UserSchema, UserToken} from "../models/User";
import {info} from "winston";
import {JWTKEY} from "../config/constanst";
import {RequestHandler} from "express";

export const TOKEN_COOKIE = 'token';
export const AUTH_HEADER = 'authorization';

export async function auth(req, res, next): Promise<UserSchema | void> {
    const cjwt = req.headers[AUTH_HEADER];

    if (!cjwt) {
        res.sendStatus(401);
        return;
    }

    try {
        const user: UserToken = jwt.verify(cjwt, JWTKEY) as UserToken;

        let userdb;

        if(!user.identifier)
            return res.status(400).send('Invalid token!');

        // language=RegExp
        if ((user.identifier as String).match("([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})"))
            userdb = await User.findOne({CPF: user.identifier}).select({password: 1, roles: 1, admin: 1});
        else
            userdb = await User.findOne({email: user.identifier}).select({password: 1, roles: 1, admin: 1});


        if (!userdb) return res.status(400).send('Invalid token!');

        next();
        //@ts-ignore
        return userdb;
    } catch (e) {
        return res.status(400).send('Invalid token!');
    }
}

export enum Roles {
    BAN_PLAYER = 'BAN_PLAYER',
    KICK_PLAYER = 'KICK_PLAYER',
    PARDON_PLAYER = 'PARDON_PLAYER',
    GET_PLAYERS = 'GET_PLAYERS',
    LOGGED_PLAYER = 'LOGGED_PLAYER',
    AUTHORIZE_PLAYER = 'AUTHORIZE_PLAYER'
}

export function getRoles() : Array<String> {
    return Object.keys(Roles);
}

export class AuthBuilder {
    protected _roles: Array<String> = [];
    protected _adminOnly: boolean = false;

    constructor() {

    }

    addRole(value: String) : AuthBuilder {
        this._roles.push(value);
        return this;
    }

    setAdminOnly(value: boolean): AuthBuilder {
        this._adminOnly = value;
        return this;
    }

    setRoles(value: Array<String>): AuthBuilder {
        this._roles = value;
        return this;
    }

    get roles(): Array<String> {
        return this._roles;
    }

    get adminOnly(): boolean {
        return this._adminOnly;
    }

    build(): RequestHandler {
        const __roles = this._roles;
        const __admin = this._adminOnly;

        //@ts-ignore
        return async function (req, res, next) : Promise<UserSchema | void> {
            const userdb: UserSchema = await auth(req, res, next) as UserSchema;

            if (!userdb) return;

            if (__roles.length > 0) {
                const roles = (userdb.roles as Array<String>);

                const contains: Number = roles.filter(P => __roles.indexOf(P.toUpperCase()) > -1).length;

                //@ts-ignore
                if (contains < 1) return res.status(403).send('Not authorized');
            }
            
            if(__admin){
                //@ts-ignore
                if(!userdb.admin) return res.status(403).send('Not authorized');
            }

            return userdb;
        };
    }
}
