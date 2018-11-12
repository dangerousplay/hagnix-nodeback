import {Router} from "express";
import {clientApi} from "../game/API";
import {auth, AuthBuilder} from "../middleware/Auth";
import * as Joi from 'joi';
import {validateBody, validateParams} from "../middleware/Validation";
import {JWTTokenExpiration} from "../config/constanst";

export const router: Router = Router();

const authAdmin = new AuthBuilder().setAdminOnly(true).build();

router.get('/', auth, (req, res, next) => {
    res.send(clientApi.getOnlinePlayers());
});

router.post('/kick', authAdmin, validateBody(validator), async (req, res, next) : Promise<any> => {
    const result = await clientApi.kickPlayer(req.body.player,req.body.reason);

    if(result == 200){
        res.send({message: 'Player kicked sucessfully.'});
    } else {
        res.status(500).send({message: 'Player not kicked.'});
    }
});

router.get('/:email', auth, validateParams(validator), async (req, res, next) : Promise<any> => {
    const player = await clientApi.getPlayer(req.params.email);

    if(!player) return res.status(404).send([]);
});

router.post('/ban', authAdmin, validateBody(validator), async (req, res, next) : Promise<any> => {
    const result = await clientApi.banPlayer(req.body.email);

    if(result == 200){
        res.send('Player banned sucessfully.');
    } else {
        res.status(500).send({message: 'Player not banned.'});
    }
});

router.post('/pardon',  authAdmin, validateBody(validator), async (req, res, next) : Promise<any> => {
    const result = await clientApi.pardonPlayer(req.body.email);

    if(result == 200){
        res.send('Player pardoned sucessfully.');
    } else {
        res.status(500).send({message: 'Player not pardoned.'});
    }
});

router.post('/authorize', authAdmin, validateBody(validator), async (req, res, next) : Promise<any> => {
   const result = await clientApi.authorize(req.body.email, JWTTokenExpiration);

    if(result == 200){
        res.send({message: 'Player authorized sucessfully.'});
    } else {
        res.status(500).send({message: 'Player not authorized.'});
    }
});

router.get('/logged/:email', auth, validateParams(validator), async (req, res, next) : Promise<any> => {
   const result = await clientApi.isLogged(req.params.email);

    if(result == 200){
        res.send(result);
    } else {
        res.status(404).send({message: 'Player not online.'});
    }
});

function validator(body:any){
    return Joi.validate(body, Joi.object().keys({
        email: Joi.string().email().required()
    }));
}