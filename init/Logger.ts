import * as winston from "winston";
import {level} from "winston";

export function init() {

    process.on("uncaughtException", (log) => {
        winston.error(log.message, log);
        winston.error(log.message, log.stack);
        process.exit(1);
    });

    process.on("unhandledRejection", (log) => {
        throw log;
    });

    winston.add(new winston.transports.Console());
    winston.add(new winston.transports.File({filename: 'logs/all.json'}));
    winston.add(new winston.transports.File({filename: 'logs/exceptions.json', level: 'error'}));

}

export function info(message: String){
    winston.info(`${new Date()} - ${message}` );
}

export function error(message: String | Error){
    if(message instanceof Error){
        winston.error(`${new Date()} - ${message.message}`, message);
    } else {
        winston.error(`${new Date()} - ${message}` );
    }
}

export function warning(message: String){
    winston.warn(`${new Date()} - ${message}` );
}