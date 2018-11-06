import {User, userSchema, UserSchema} from "../../models/User";
import {auth, AuthBuilder} from "../../middleware/Auth";
import * as jwt from 'jsonwebtoken';
import {JWTKEY} from "../../config/constanst";

describe('Auth Middleware', () => {
    let admin;
    let normalUser;
    let response = {
        statusCode: 0,
        messageSend: '',
        send: function (v: string) : void {
            this.messageSend = v;
        },
        sendStatus: function(v){
            this.statusCode = v;
            return v;
        },
        status: function(v){
            this.statusCode = v;
            return this;
        }
    };

    let request = {
        headers: []
    };

    //@ts-ignore
    beforeEach(async () => {
        const user: UserSchema = {
            CPF: "04908861080",
            CEP: "92410535",
            password: "123456789",
            name: "Davi Henrique",
            house: "583",
            complement: "",
            bairro: "Igara",
            street: "Doutor Alfredo Ângelo Filho",
            admin: true,
            roles: [],
            email: 'gm.davi.gm@live.com'
        };

        const user2: UserSchema = {
            CPF: "04908861081",
            CEP: "92410535",
            password: "123456789",
            name: "Davi Henrique2",
            house: "583",
            bairro: "Igara",
            complement: "",
            street: "Doutor Alfredo Ângelo Filho",
            admin: false,
            roles: [],
            email: 'gm.davi.gm2@live.com'
        };

        const userdb = new User(user);
        await userdb.save();

        const userdb2 = new User(user2);
        await userdb2.save();

        normalUser = user2;
        admin = user;
    });

    //@ts-ignore
    afterEach(async () => {
       await User.remove({});
    });

    describe('Single Middleware', () => {

        //@ts-ignore
        it('Should return 401 if no authorization is provided', async () => {
            const user:UserSchema = await auth(request,response, function next(){}) as UserSchema;

            expect(user).toBeUndefined();

            expect(response.statusCode).toEqual(401);

        }, 30000);

        //@ts-ignore
        it('Should return 400 if the token is invalid',async () => {
            request.headers['authorization'] = 'a';

            const user:UserSchema = await auth(request,response,  function next(){}) as UserSchema;

            expect(user).toBeUndefined();

            expect(response.statusCode).toEqual(400);
        });

        //@ts-ignore
        it('Should return 400 if the token payload is invalid',async () => {
            request.headers['authorization'] = jwt.sign({identifier: 'dangerousplay@gmail.com', password: 'ddat'}, JWTKEY);

            const user:UserSchema = await auth(request,response,  function next(){}) as UserSchema;

            expect(user).toBeUndefined();

            expect(response.statusCode).toEqual(400);
        });

        //@ts-ignore
        it('Should return 400 if the token payload is invalid',async () => {
            request.headers['authorization'] = jwt.sign({}, JWTKEY);

            const user:UserSchema = await auth(request,response,  function next(){}) as UserSchema;

            expect(user).toBeUndefined();

            expect(response.statusCode).toEqual(400);
        });

        //@ts-ignore
        it('Should return 400 if the token payload contains invalid user',async () => {
            request.headers['authorization'] = jwt.sign({identifier: 'dangerousplay@gmail.com', password: 'ddat'}, JWTKEY);

            const user:UserSchema = await auth(request,response,  function next(){}) as UserSchema;

            expect(user).toBeUndefined();

            expect(response.statusCode).toEqual(400);
        });

        //@ts-ignore
        it('Should return 200 if the token payload contains valid user',async () => {
            request.headers['authorization'] = jwt.sign({identifier: 'gm.davi.gm2@live.com', password: '123456789'}, JWTKEY);

            const user:UserSchema = await auth(request,response,  function next(){}) as UserSchema;

            expect(user).toBeDefined();

            expect(user).toHaveProperty('password' );
            expect(user).toHaveProperty('roles');
            expect(user).toHaveProperty('admin');

            expect(response.statusCode).toEqual(200);
        });

    });

});