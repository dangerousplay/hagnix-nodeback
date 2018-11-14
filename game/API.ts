import {info, warn} from "winston";

const feignjs = require("feignjs");
const RequestClient = require("feignjs-request");
import * as jwt from 'jsonwebtoken';
import {JWTKEY, RequestChannel, ResponseChannel} from "../config/constanst";
import * as redis from 'redis';
import * as uuid from 'uuid';
import {EventEmitter} from "events";
import {ClientOpts, RedisClient, RetryStrategy} from "redis";


const host = process.env.REDIS_HOST;
const password = process.env.REDIS_PASSWORD;
const port = process.env.REDIS_PORT;

const queue: Array<RID | undefined> = [];

const event = new EventEmitter();

let sender: RedisClient;
let listener: RedisClient;

startRedis();

interface RID {
    id: String,
    resolve: any,
    timer: any
}

enum Command {
    KICK = 'KICK',
    LIST = 'LIST',
    GET_PLAYER = 'GETPLAYER',
    BAN = 'BAN',
    PARDON = 'PARDON',
    LOGGED = 'LOGGED',
    AUTHORIZE = 'AUTHORIZE',
    CREATE_PLAYER = 'CREATE_PLAYER',
    DELETE_PLAYER = 'DELETE_PLAYER',
    CHANGE_PLAYER = 'CHANGE_PLAYER',
    SERVER_INFO = 'SERVER_INFO'
}

function startRedis(){
    //@ts-ignore
    let connection:ClientOpts = null;

    if(host || password || port)
       connection = {host, port: parseInt(port), password: password && password.length > 0 ? password : undefined};

    try {
        info(`Connecting on redis: ${connection != null ? JSON.stringify({host, port}):'localhost'}`);

        if(connection){
            sender = redis.createClient(connection);
            listener = redis.createClient(connection);
        }else {
            sender = redis.createClient();
            listener = redis.createClient();
        }

        createListener()
    }catch (e) {
        warn(e.message);
        setTimeout(() => startRedis(), 1000);
    }
}

export interface ClientAPI {

    isLogged(email: String): Promise<Number>;

    getPlayer(email: String): Promise<Player>;

    banPlayer(email: String): Promise<Number>;

    kickPlayer(email: String, reason: String): Promise<Number>;

    authorize(email: String, duration: Number): Promise<Number>;

    getOnlinePlayers(): Promise<Array<Player>>;

    pardonPlayer(email: String): Promise<Number>;

    createPlayer(email: String, password: String, objectId: String) : Promise<Number>;

    deletePlayer(emailOrId: String) : Promise<Number>;

    changePlayer(player: Player) : Promise<Number>;

    serverInfo(): Promise<Server>;
}

export interface Server {
    name: String,
    players: number,
    capacity: number
}

export interface Player {
    email: String,
    name: String,
    admin: boolean,
    token: number,
    gold: number,
    password: String
}

interface Request<T> {
    id: String,
    command: String,
    args: Array<T>
}

interface Response<T> {
    id: String
    status: Number,
    content: Array<T>
}

const clientAPIDESC = {
    authorize: "POST api/client/auth",
    banPlayer: "POST api/client/ban",
    getOnlinePlayers: "GET api/client/",
    getPlayer: "GET api/client/{email}",
    isLogged: "POST api/client/logged",
    kickPlayer: "POST api/client/kick"
};

class ClientImplementation implements ClientAPI {
    async authorize(email: String, duration: Number): Promise<Number> {
        const response:Response<String> = await createRequest(Command.AUTHORIZE, [{email, expiration: duration}]);

        return response.status;
    }

    async banPlayer(email: String ): Promise<Number> {
        const response:Response<String> = await createRequest(Command.BAN, [{email}]);

        return response.status;
    }

    async getOnlinePlayers(): Promise<Array<Player>> {
        const response:Response<Player> = await createRequest(Command.LIST, []);
        return response.content;
    }

    async getPlayer(email: String): Promise<Player> {
        const response:Response<Player> = await createRequest(Command.GET_PLAYER, [{email}]);
        return response.content[0];
    }

    async isLogged(email: String): Promise<Number> {
        const response:Response<String> = await createRequest(Command.LOGGED, [{email}]);

        return response.status;
    }

    async kickPlayer(email: String, reason: String): Promise<Number> {
        const response:Response<String> = await createRequest(Command.KICK, [{email}]);

        return response.status;
    }

    async pardonPlayer(email: String): Promise<Number> {
        const response:Response<String> = await createRequest(Command.PARDON, [{email}]);
        return response.status;
    }

    async createPlayer(email: String, password: String, objectId: String): Promise<Number> {
        return (await createRequest(Command.CREATE_PLAYER, [{email, password, object_id: objectId}])).status;
    }

    async changePlayer(player: Player): Promise<Number> {
        return (await createRequest(Command.CHANGE_PLAYER, [player])).status
    }

    async deletePlayer(id: String): Promise<Number> {
        return (await createRequest(Command.DELETE_PLAYER, [id])).status;
    }

    async serverInfo(): Promise<Server> {
        return await createRequest(Command.SERVER_INFO, []);
    }

}

function generateToken() {
    return jwt.sign({server: 'Node js backend'}, JWTKEY);
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


event.on('response', (response:string) => {
    try {
        const respObj:Response<any> = JSON.parse(response);

        //@ts-ignore
        const p = queue.filter(P => P.id == respObj.id) as RID[];

        if(!p[0])
            return;

        p[0].resolve(respObj);

        clearTimeout(p[0].timer);

        queue.splice(queue.indexOf(p[0]),1);
    }catch (e) {
        warn(e);
    }
});

function createListener(){
    listener.on("message", ((channel, message) => {
        info("Message received: " + message);
        event.emit('response', message);
    }));

    listener.subscribe(ResponseChannel);
}

function createRequest(command:String, args: Array<any>) : Promise<any> {

    //@ts-ignore
    return new Promise<Response<any>>(((resolve, reject) => {
        const id = uuid.v4();

        const timer = setTimeout(() => {
            resolve({id, status: 500, content:[]});
        },3000);

        queue.push({id, resolve: resolve, timer });
        sender.publish(RequestChannel, JSON.stringify({
            command: command,
            id,
            args: args
        }));
    }));
}

export const clientApi: ClientAPI = new ClientImplementation();

