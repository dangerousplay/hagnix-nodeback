"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../models/User");
const Auth_1 = require("../../middleware/Auth");
const jwt = __importStar(require("jsonwebtoken"));
const constanst_1 = require("../../config/constanst");
describe('Auth Middleware', () => {
    let admin;
    let normalUser;
    let response = {
        statusCode: 0,
        messageSend: '',
        send: function (v) {
            this.messageSend = v;
        },
        sendStatus: function (v) {
            this.statusCode = v;
            return v;
        },
        status: function (v) {
            this.statusCode = v;
            return this;
        }
    };
    let request = {
        headers: []
    };
    //@ts-ignore
    beforeEach(async () => {
        const user = {
            CPF: "04908861080",
            CEP: "92410535",
            password: "123456789",
            name: "Davi Henrique",
            house: "583",
            bairro: "Igara",
            street: "Doutor Alfredo Ângelo Filho",
            admin: true,
            roles: [],
            email: 'gm.davi.gm@live.com'
        };
        const user2 = {
            CPF: "04908861081",
            CEP: "92410535",
            password: "123456789",
            name: "Davi Henrique2",
            house: "583",
            bairro: "Igara",
            street: "Doutor Alfredo Ângelo Filho",
            admin: false,
            roles: [],
            email: 'gm.davi.gm2@live.com'
        };
        const userdb = new User_1.User(user);
        await userdb.save();
        const userdb2 = new User_1.User(user2);
        await userdb2.save();
        normalUser = user2;
        admin = user;
    });
    //@ts-ignore
    afterEach(async () => {
        await User_1.User.remove({});
    });
    describe('Single Middleware', () => {
        //@ts-ignore
        it('Should return 401 if no authorization is provided', async () => {
            const user = await Auth_1.auth(request, response, function next() { });
            expect(user).toBeUndefined();
            expect(response.statusCode).toEqual(401);
        }, 30000);
        //@ts-ignore
        it('Should return 400 if the token is invalid', async () => {
            request.headers['authorization'] = 'a';
            const user = await Auth_1.auth(request, response, function next() { });
            expect(user).toBeUndefined();
            expect(response.statusCode).toEqual(400);
        });
        //@ts-ignore
        it('Should return 400 if the token payload is invalid', async () => {
            request.headers['authorization'] = jwt.sign({ identifier: 'dangerousplay@gmail.com', password: 'ddat' }, constanst_1.JWTKEY);
            const user = await Auth_1.auth(request, response, function next() { });
            expect(user).toBeUndefined();
            expect(response.statusCode).toEqual(400);
        });
        //@ts-ignore
        it('Should return 400 if the token payload is invalid', async () => {
            request.headers['authorization'] = jwt.sign({}, constanst_1.JWTKEY);
            const user = await Auth_1.auth(request, response, function next() { });
            expect(user).toBeUndefined();
            expect(response.statusCode).toEqual(400);
        });
        //@ts-ignore
        it('Should return 400 if the token payload contains invalid user', async () => {
            request.headers['authorization'] = jwt.sign({ identifier: 'dangerousplay@gmail.com', password: 'ddat' }, constanst_1.JWTKEY);
            const user = await Auth_1.auth(request, response, function next() { });
            expect(user).toBeUndefined();
            expect(response.statusCode).toEqual(400);
        });
        //@ts-ignore
        it('Should return 200 if the token payload contains valid user', async () => {
            request.headers['authorization'] = jwt.sign({ identifier: 'gm.davi.gm2@live.com', password: '123456789' }, constanst_1.JWTKEY);
            const user = await Auth_1.auth(request, response, function next() { });
            expect(user).toBeDefined();
            expect(user).toHaveProperty('password');
            expect(user).toHaveProperty('roles');
            expect(user).toHaveProperty('admin');
            expect(response.statusCode).toEqual(200);
        });
    });
});
