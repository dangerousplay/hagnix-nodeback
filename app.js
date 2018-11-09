"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require('express-async-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Rest = __importStar(require("./init/RESTful"));
const Database = __importStar(require("./init/MongoDB"));
const logger = __importStar(require("./init/Logger"));
const authRouter = __importStar(require("./routes/auth"));
const client = __importStar(require("./routes/client"));
const health = __importStar(require("./routes/health"));
const server = __importStar(require("./routes/server"));
const API_1 = require("./game/API");
const winston_1 = require("winston");
exports.app = express();
exports.appHealth = false;
//app.use(logger('dev'));
exports.app.use(require('helmet')());
exports.app.use(express.json());
exports.app.use(express.urlencoded({ extended: false }));
exports.app.use(cookieParser());
exports.app.use(cors());
exports.app.use('/api/auth', authRouter.router);
exports.app.use('/api/client', client.router);
exports.app.use('/health', health.router);
exports.app.use('/server', server.router);
async function loadModules() {
    logger.init();
    Rest.init(exports.app);
    Database.init();
}
async function reportHealth() {
    await loadModules();
    exports.appHealth = true;
}
reportHealth();
//TODO remove this NOW
async function teste() {
    // const user = new User({
    //     CPF: "04908861082",
    //     CEP: "92410535",
    //     password: "1234567891",
    //     name: "Davi Henrique3",
    //     house: "587",
    //     complement: "",
    //     bairro: "Igara",
    //     street: "Doutor Alfredo Ângelo Filho",
    //     admin: true,
    //     roles: [],
    //     email: 'gm.davi.gm3@live.com',
    //     login: {
    //         attempts: 0,
    //         lastAttempt: new Date(),
    //         locked: false
    //     }
    // }) as UserSchema;
    //
    // await user.save();
    const auth = await API_1.clientApi.authorize('davificanhahenrique@hotmail.com', 60 * 60 * 1000);
    winston_1.info(`Authorize returned: ${auth}`);
    setInterval(async () => {
        const retunerd = await API_1.clientApi.isLogged('davificanhahenrique@hotmail.com');
        winston_1.info(`isLogged returned on api: ${retunerd}`);
        const players = await API_1.clientApi.getOnlinePlayers();
        winston_1.info(`Online players ${JSON.stringify(players)}`);
        const server = await API_1.clientApi.serverInfo();
        winston_1.info(`Server info: ${JSON.stringify(server)}`);
    }, 3000);
}
teste();
