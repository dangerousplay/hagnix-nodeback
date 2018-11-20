"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const Auth_1 = require("../middleware/Auth");
const Validation_1 = require("../middleware/Validation");
const Joi = __importStar(require("joi"));
const API_1 = require("../game/API");
const restful = require('node-restful');
const methods = ['get', 'post', 'put', 'delete'];
const authAdmin = new Auth_1.AuthBuilder().setAdminOnly(true).build();
const authLogged = new Auth_1.AuthBuilder().build();
function route(route, app) {
    const resource = restful.model('users', User_1.userSchema)
        .methods(methods);
    methods.filter((p) => p == 'get' || p == 'post' || p == 'delete' || p == 'put')
        .forEach((p) => {
        resource.before(p, authAdmin);
    });
    resource.after('get', (req, res, next) => {
        console.log(res.locals.bundle);
        res.locals.bundle = res.locals.bundle.map((e) => { e.password = ""; return e; });
        next();
    });
    resource.after('delete', async (req, res, next) => {
        const request = await API_1.clientApi.deletePlayer(req.params.id);
        res.sendStatus(request);
        next();
    });
    resource.before('post', async (req, res, next) => {
        const player = await API_1.clientApi.getPlayer(req.body.email);
        if (!player) {
            next();
        }
        else {
            res.status(400).send('email already in use');
        }
    });
    resource.after('post', async (req, res, next) => {
        const player = req.body;
        const playerDB = await User_1.User.findOne({ email: player.email }).select({ _id: 1 });
        await API_1.clientApi.createPlayer(player.email, player.password, playerDB._id);
        next();
    });
    resource.after('put', async (req, res, next) => {
        const player = req.body;
        if (player.banned)
            await API_1.clientApi.banPlayer(player.email);
    });
    //@ts-ignore
    resource.route('changepw', async (req, res, next) => {
        const user = await authLogged(req, res, next);
        const error = Validation_1.validateBody(validate)(req, res, next);
        if (!user || error) {
            return;
        }
        user.password = req.body.new;
        user.save();
    });
    // restful.enableCors(resource);
    resource.register(app, route);
}
exports.route = route;
function validate(body) {
    return Joi.validate(body, Joi.object().keys({
        old: Joi.string().min(8).required(),
        new: Joi.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/).required()
    }));
}
