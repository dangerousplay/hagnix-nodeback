import {UserSchema, userSchema} from "../models/User";
import {NextFunction} from "express";
import {auth} from "../middleware/Auth";
import {info} from "winston";
import {AuthBuilder} from "../middleware/Auth";
import {validateBody} from "../middleware/Validation";
import * as Joi from "joi";
import {User} from "../models/User";

const restful = require('node-restful');
const cors = require('cors');
const methods = ['get', 'post', 'put', 'delete'];

const authAdmin = new AuthBuilder().setAdminOnly(true).build();
const authLogged = new AuthBuilder().build();

export function route(route: String, app: Express.Application) {
    const resource = restful.model('users', userSchema)
        .methods(methods);

    methods.filter((p) => p == 'get' || p == 'post' || p == 'delete' || p == 'put')
        .forEach((p) => {
        resource.before(p, authAdmin)
    });

    //@ts-ignore
    resource.route('changepw', async (req, res, next) : Promise<void> => {
        const user:UserSchema = await authLogged(req, res, next);
        const error = validateBody(validate)(req, res, next);

        if(!user || error){
            return;
        }

        user.password = req.body.new;
        // @ts-ignore
        user.save();
    });

    // restful.enableCors(resource);

    resource.register(app, route);
}

function validate(body:any){
    return Joi.validate(body, Joi.object().keys({
        old: Joi.string().min(8).required(),
        new: Joi.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/).required()
    }));
}
