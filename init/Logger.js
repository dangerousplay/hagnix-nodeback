"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston = __importStar(require("winston"));
function init() {
    process.on("uncaughtException", (log) => {
        winston.error(log.message, log);
        winston.error(log.message, log.stack);
        process.exit(1);
    });
    process.on("unhandledRejection", (log) => {
        throw log;
    });
    winston.add(new winston.transports.Console());
    winston.add(new winston.transports.File({ filename: 'logs/all.json' }));
    winston.add(new winston.transports.File({ filename: 'logs/exceptions.json', level: 'error' }));
}
exports.init = init;
function info(message) {
    winston.info(`${new Date()} - ${message}`);
}
exports.info = info;
function error(message) {
    if (message instanceof Error) {
        winston.error(`${new Date()} - ${message.message}`, message);
    }
    else {
        winston.error(`${new Date()} - ${message}`);
    }
}
exports.error = error;
function warning(message) {
    winston.warn(`${new Date()} - ${message}`);
}
exports.warning = warning;
