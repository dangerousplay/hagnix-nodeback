import {Router} from "express";
import {auth} from "../middleware/Auth";
import {clientApi} from "../game/API";

export const router: Router = Router();

router.get('/status', auth, async (req, res, next) : Promise<void> => {
    res.send([await clientApi.serverInfo()]);
});