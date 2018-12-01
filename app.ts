import {User, UserSchema} from "./models/User";

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

const origin = process.env.CORS_ORIGIN;
//app.use(logger('dev'));
app.use(require('helmet')());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({origin: origin || 'http://localhost:4200', credentials: true, preflightContinue: true}));

app.use('/api/auth',authRouter.router);
app.use('/api/client', client.router);
app.use('/health', health.router);
app.use('/api/server', server.router);

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
    const user = new User({
        CPF: "04908861082",
        CEP: "92410535",
        password: "1234567891",
        name: "Davi Henrique3",
        house: "587",
        complement: "",
        bairro: "Igara",
        street: "Doutor Alfredo Ângelo Filho",
        admin: true,
        roles: [],
        email: 'gm.davi.gm3@live.com',
        login: {
            attempts: 0,
            lastAttempt: new Date(),
            locked: false
        }
    }) as UserSchema;

    await user.save();

    const auth = await clientApi.authorize('davificanhahenrique@hotmail.com',  60*60 *1000);
    info(`Authorize returned: ${auth}`);

}


