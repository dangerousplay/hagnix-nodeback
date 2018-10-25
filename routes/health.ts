import {Router} from "express";
import {appHealth} from "../app";

export const router = Router();

router.get('/', ((req, res, next) => {
    if(appHealth)
        res.sendStatus(200);
    else
        res.sendStatus(500);
}));
