import {User, UserSchema, userSchema} from "../models/User";
import {AuthBuilder} from "../middleware/Auth";
import {validateBody} from "../middleware/Validation";
import * as Joi from "joi";
import {clientApi} from "../game/API";

const restful = require('node-restful');
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

    resource.after('delete', async (req:any, res:any, next:any) : Promise<void> => {
       const request = await clientApi.deletePlayer(req.params.id);

       res.sendStatus(request);
        next();
    });

    resource.before('post', async (req:any, res:any, next:any) : Promise<void> => {
       const player = await clientApi.getPlayer(req.body.email);

        if(!player){
          next()
        } else {
            res.status(400).send('email already in use');
        }
    });

    resource.after('post', async (req:any, res:any, next:any) : Promise<void> => {
        const player: UserSchema = req.body;
        const playerDB = await User.findOne({email: player.email}).select({_id: 1});

        await clientApi.createPlayer(player.email, player.password, playerDB._id);

        next();
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
