const config = require('config');

const mongoose = require('mongoose');
import * as logger from "../init/Logger";
//mongodb://username:password@host:port/
const pHost = process.env.MONGO_HOST;
const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const port = process.env.MONGO_PORT;
const database = process.env.MONGO_DATABASE;

const host = (
                   pHost != null ?
                   "mongodb://" +
                   (user != null ? user : ""                ) +
                   (password != null ? ":"+password+"@" : "") +
                   (pHost                                   ) +
                   (port != null ? ":"+port+"/" : ":27017/" ) +
                   (database != null ? database:""          )
               : null
             )
    || config.get('mongodb-host')
    || 'mongodb://localhost/mongo-exercises';

logger.info(`MongoDB connection string: ${host}`);

export async function init() : Promise<void> {
    try {
        await mongoose.connect(host);
        logger.info(`Connected on MongoDB at host: ${host}`);
    }catch (e) {
        logger.warning(e.message);
        setTimeout(() => {
            init();
        }, 1000);
    }

}

