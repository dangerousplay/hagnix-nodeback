require('express-async-errors');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

import * as Rest from "./init/RESTful";
import * as Database from "./init/MongoDB";
import * as logger from "./init/Logger";
import * as authRouter from "./routes/auth";
import * as client from './routes/client';
import * as health from './routes/health';
import * as server from './routes/server';
import {clientApi} from "./game/API";
import {info} from "winston";

export const app = express();
export let appHealth = false;

//app.use(logger('dev'));
app.use(require('helmet')());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/api/auth',authRouter.router);
app.use('/api/client', client.router);
app.use('/health', health.router);
app.use('/server', server.router);

async function loadModules() : Promise<void> {
    logger.init();
    Rest.init(app);
    Database.init();
}

async function reportHealth() : Promise<void> {
   await loadModules();

   appHealth = true;
}

reportHealth();

//TODO remove this NOW
async function teste() : Promise<void> {
    const auth = await clientApi.authorize('davificanhahenrique@hotmail.com',  60*60 *1000);
    info(`Authorize returned: ${auth}`);

    const retunerd = await  clientApi.isLogged('davificanhahenrique@hotmail.com');
    info(`isLogged returned on api: ${retunerd}`);

    const players = await clientApi.getOnlinePlayers();
    info(`Online players ${JSON.stringify(players)}`);

    const pardon = await clientApi.pardonPlayer("davificanhahenrique@hotmail.com");
    info(`Pardon: ${pardon}`);
}

teste();


