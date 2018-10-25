import {Router} from "express";
import {User, UserToken} from "../models/User";
import {TOKEN_COOKIE} from "../middleware/Auth";
import {error} from "../init/Logger";
import * as jwt from "jsonwebtoken";
import {JWTTokenExpiration, JWTKEY, JWTRTokenExpiration, EmailREGEX} from "../config/constanst";
import * as bcrypt from 'bcrypt';
import * as joi from 'joi';
import {ValidationResult} from "joi";
import {validateBody} from "../middleware/Validation";

export const router: Router = Router();

// language=RegExp
const identifier = /([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})/;

router.post('/', validateBody(validationResult), async (req, res, next) => {
    let userdb;
    // language=RegExp
    if ((req.body.identifier as String).match("([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})"))
        userdb = await User.findOne({CPF: req.body.identifier}).select({password: 1, admin: 1, roles: 1});
    else
        userdb = await User.findOne({email: req.body.identifier}).select({password: 1, admin: 1, roles: 1});

    if (!userdb) return res.status(400).send('Bad credentials!');

    const equal = bcrypt.compareSync(req.body.password, userdb.password);

    if (!equal) return res.status(400).send('Bad credentials!');

    const refreshToken: UserToken = {
        identifier: req.body.identifier,
        admin: userdb.admin,
        roles: userdb.roles,
        refreshToken: true
    };

    const jrToken = jwt.sign(refreshToken, JWTKEY, {expiresIn: JWTRTokenExpiration});

    const jToken = jwt.sign({
            identifier: req.body.identifier,
            admin: userdb.admin,
            roles: userdb.roles,
            refreshToken: false
        },
        JWTKEY,
        {expiresIn: JWTTokenExpiration});

    res.cookie(TOKEN_COOKIE, jrToken);
    res.send({token: jToken});
});

//@ts-ignore
router.get('/token', async (req, res, next) => {
    const token = req.cookies[TOKEN_COOKIE];

    try {
        const user: UserToken = jwt.verify(token, JWTKEY) as UserToken;

        let userdb;

        // language=RegExp
        if ((req.body.identifier as String).match("([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})"))
            userdb = await User.findOne({CPF: req.body.identifier}).select({password: 1, admin: 1, roles: 1});
        else
            userdb = await User.findOne({email: req.body.identifier}).select({password: 1, admin: 1, roles: 1});

        if (!userdb) {
            return res.clearCookie(TOKEN_COOKIE).status(400).send('Invalid Token');
        }

        user.refreshToken = false;

        user.exp = new Date().getTime() + JWTTokenExpiration;

        res.send({token: jwt.sign(user, JWTKEY)});
    } catch (e) {
        error(e);
        res.sendStatus(400);
    }

});


router.get('/revoke', ((req, res, next) => {
    const token = req.cookies[TOKEN_COOKIE];

    if(!token) return res.status(400).send('No cookie provided!');

    res.clearCookie(TOKEN_COOKIE);
}));

function validationResult(body: any) : ValidationResult<any>{
    return joi.validate(body, joi.object().keys({
        identifier: joi.string().regex(new RegExp("([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}-[0-9]{2})|([0-9]{11})|" + EmailREGEX)),
        password: joi.string().min(8)
    }));
}