import {Router} from "express";
import {User, UserSchema, UserToken} from "../models/User";
import {TOKEN_COOKIE} from "../middleware/Auth";
import * as jwt from "jsonwebtoken";
import {JWTTokenExpiration, JWTKEY, JWTRTokenExpiration, EmailREGEX} from "../config/constanst";
import * as bcrypt from 'bcrypt';
import * as joi from 'joi';
import {ValidationResult} from "joi";
import {validateBody} from "../middleware/Validation";
import {clientApi} from "../game/API";
import {info} from "../init/Logger";

export const router: Router = Router();

const debug = process.env.DEBUG;

router.post('/', validateBody(validationResult), async (req, res, next) => {
    let userdb: UserSchema;

    // language=RegExp
    if ((req.body.identifier as String).match("([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})"))
    //@ts-ignore
        userdb = await User.findOne({CPF: req.body.identifier});
    else
    //@ts-ignore
        userdb = await User.findOne({email: req.body.identifier});

    if (!userdb) return res.status(400).send('Bad credentials!');

    const epoch = Math.round(new Date().getTime() / 1000);
    //@ts-ignore
    const userAttempt = Math.round(userdb.login.lastAttempt.getTime() / 1000);

    if(userdb.login.locked) {
        if((epoch - userAttempt) < 3600) {
            return res.status(403).send({
                message: `Your account is locked due to a multiple wrong password attempts.`,
                lastAttempt: userdb.login.lastAttempt
            });
        } else {
            userdb.login.attempts = 0;
        }
    }

    const equal = bcrypt.compareSync(req.body.password, userdb.password);

    if (!equal) {
        userdb.login.attempts++;
        userdb.login.lastAttempt = new Date();
        if(userdb.login.attempts > 5) userdb.login.locked = true;

        userdb.save();
        return res.status(400).send('Bad credentials!');
    }

    userdb.login.attempts = 0;
    userdb.login.lastAttempt = new Date();
    userdb.login.locked = false;

    const refreshToken: UserToken = {
        identifier: req.body.identifier,
        admin: userdb.admin,
        roles: userdb.roles,
        email: userdb.email,
        name: userdb.name,
        refreshToken: true
    };

    const jrToken = jwt.sign(refreshToken, JWTKEY, {expiresIn: JWTRTokenExpiration});

    const jToken = jwt.sign({
            identifier: req.body.identifier,
            admin: userdb.admin,
            roles: userdb.roles,
            email: userdb.email,
            name: userdb.name,
            refreshToken: false
        },
        JWTKEY,
        {expiresIn: JWTTokenExpiration});

    res.cookie(TOKEN_COOKIE, jrToken, {secure: false, httpOnly: true});

    res.send({token: jToken});

    const response = await clientApi.authorize(userdb.email, JWTRTokenExpiration);

    if(debug){
        info(`Authorized user: ${userdb}, server response: ${response}`)
    }
});

router.post('/token', validateBody(validateIdentifier), async (req, res, next) : Promise<any> => {
    const token = req.cookies[TOKEN_COOKIE];

    try {
        const user: UserToken = jwt.verify(token, JWTKEY) as UserToken;

        let userdb: UserSchema;

        // language=RegExp
        if ((req.body.identifier as String).match("([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})"))
            userdb = await User.findOne({CPF: req.body.identifier});
        else
            userdb = await User.findOne({email: req.body.identifier});

        if (!userdb) {
            return res.clearCookie(TOKEN_COOKIE).status(400).send('Invalid Token');
        }

        user.refreshToken = false;
        //@ts-ignore
        user.exp = new Date().getTime() + JWTTokenExpiration;

        delete userdb.password;

        res.send({token: jwt.sign(user, JWTKEY)});
    } catch (e) {
        res.sendStatus(400);
    }

});



router.post('/revoke',  (async (req, res, next) => {
    const token = req.cookies[TOKEN_COOKIE];

    if(!token) return res.status(400).send('No cookie provided!');

    res.clearCookie(TOKEN_COOKIE);
    try{
        const uToken: UserToken = jwt.verify(token, JWTKEY) as UserToken;
        await clientApi.authorize(uToken.email,0);
    }catch (e) {

    }
}));

router.get('/logged', (async (req, res, next) => {
    const token = req.cookies[TOKEN_COOKIE];

    if(!token) return res.send({logged: false});

    try {
        jwt.verify(token, JWTKEY);
        res.send({logged: true});
    }catch (e) {
        return res.send({logged: false});
    }
}));

function validateIdentifier(body: any){
    return joi.validate(body, joi.object().keys({
        identifier: joi.string().regex(new RegExp("([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})|" + EmailREGEX)),
    }));
}

function validationResult(body: any) : ValidationResult<any> {
    return joi.validate(body, joi.object().keys({
        identifier: joi.string().regex(new RegExp("([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})|" + EmailREGEX)),
        password: joi.string().min(8)
    }));
}