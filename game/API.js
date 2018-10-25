"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const feignjs = require("feignjs");
const RequestClient = require("feignjs-request");
const jwt = __importStar(require("jsonwebtoken"));
const constanst_1 = require("../config/constanst");
const redis = __importStar(require("redis"));
const uuid = __importStar(require("uuid"));
const events_1 = require("events");
const host = process.env.REDIS_HOST;
const password = process.env.REDIS_PASSWORD;
const port = process.env.REDIS_PORT;
const queue = [];
const event = new events_1.EventEmitter();
let sender;
let listener;
function startRedis() {
    //@ts-ignore
    let connection = null;
    if (host && password && port)
        connection = { host, port: parseInt(port), password };
    try {
        winston_1.info(`Connecting on redis: ${connection != null ? JSON.stringify({ host, port }) : 'localhost'}`);
        if (connection) {
            sender = redis.createClient(connection);
            listener = redis.createClient(connection);
        }
        else {
            sender = redis.createClient();
            listener = redis.createClient();
        }
        createListener();
    }
    catch (e) {
        winston_1.warn(e.message);
        setTimeout(() => startRedis(), 1000);
    }
}
startRedis();
var Command;
(function (Command) {
    Command["KICK"] = "KICK";
    Command["LIST"] = "LIST";
    Command["GET_PLAYER"] = "GETPLAYER";
    Command["BAN"] = "BAN";
    Command["PARDON"] = "PARDON";
    Command["LOGGED"] = "LOGGED";
    Command["AUTHORIZE"] = "AUTHORIZE";
})(Command || (Command = {}));
const clientAPIDESC = {
    authorize: "POST api/client/auth",
    banPlayer: "POST api/client/ban",
    getOnlinePlayers: "GET api/client/",
    getPlayer: "GET api/client/{email}",
    isLogged: "POST api/client/logged",
    kickPlayer: "POST api/client/kick"
};
class ClientImplementation {
    async authorize(email, duration) {
        const response = await createRequest(Command.AUTHORIZE, [{ email, expiration: duration }]);
        return response.status;
    }
    async banPlayer(email) {
        const response = await createRequest(Command.BAN, [{ email }]);
        return response.status;
    }
    async getOnlinePlayers() {
        const response = await createRequest(Command.LIST, []);
        return response.content;
    }
    async getPlayer(email) {
        const response = await createRequest(Command.GET_PLAYER, [{ email }]);
        return response.content[0];
    }
    async isLogged(email) {
        const response = await createRequest(Command.LOGGED, [{ email }]);
        return response.status;
    }
    async kickPlayer(email, reason) {
        const response = await createRequest(Command.KICK, [{ email }]);
        return response.status;
    }
    async pardonPlayer(email) {
        const response = await createRequest(Command.PARDON, [{ email }]);
        return response.status;
    }
}
function generateToken() {
    return jwt.sign({ server: 'Node js backend' }, constanst_1.JWTKEY);
}
const client = feignjs.builder()
    .client(new RequestClient({
    defaults: {
        headers: {
            'User-Agent': 'request',
            'Authorization': `${generateToken()}`
        }
    }
}))
    .target(clientAPIDESC, 'https://api.github.com');
event.on('response', (response) => {
    try {
        const respObj = JSON.parse(response);
        //@ts-ignore
        const p = queue.filter(P => P.id == respObj.id);
        if (!p[0])
            return;
        p[0].resolve(respObj);
        clearTimeout(p[0].timer);
        queue.splice(queue.indexOf(p[0]), 1);
    }
    catch (e) {
        winston_1.warn(e);
    }
});
function createListener() {
    listener.on("message", ((channel, message) => {
        winston_1.info("Message received: " + message);
        event.emit('response', message);
    }));
    listener.subscribe(constanst_1.ResponseChannel);
}
function createRequest(command, args) {
    //@ts-ignore
    return new Promise(((resolve, reject) => {
        const id = uuid.v4();
        const timer = setTimeout(() => {
            resolve({ id, status: 500, content: [] });
        }, 3000);
        queue.push({ id, resolve: resolve, timer });
        sender.publish(constanst_1.RequestChannel, JSON.stringify({
            command: command,
            id,
            args: args
        }));
    }));
}
exports.clientApi = new ClientImplementation();
