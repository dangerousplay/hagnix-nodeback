import {Router} from "express";
import {auth} from "../middleware/Auth";
import {clientApi} from "../game/API";

export const router: Router = Router();

router.get('/status', auth, ((req, res, next) => {
    res.send(await clientApi.getOnlinePlayers());
}));