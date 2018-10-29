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
const app_1 = require("../../app");
const response = __importStar(require("supertest"));
describe('User REST API', () => {
    let admin;
    let normalUser;
    const request = response.agent(app_1.app);
    async function beforeEachCall() {
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
    }
    describe('GET /', () => {
        beforeEach(async () => {
            await beforeEachCall();
        });
        afterEach(async () => {
            await User_1.User.remove({});
        });
        it('Should return all users if User is admin and logged in', async () => {
            const response = await request.post('/api/auth').send({ identifier: admin.CPF, password: admin.password });
            expect(response.status).toEqual(200);
            // language=RegExp
            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
            const responseGet = await request.get('/api/users').set('Authorization', response.body.token);
            expect(responseGet.status).toEqual(200);
            expect(responseGet.body).toBeDefined();
            expect(responseGet.body.length).toEqual(2);
        });
        it('Should return 401 if the user is not logged in', async () => {
            const responseGet = await request.get('/api/users');
            expect(responseGet.status).toEqual(401);
        });
        it('Should return 403 if the user is logged but not admin', async () => {
            const response = await request.post('/api/auth').send({ identifier: normalUser.CPF, password: normalUser.password });
            expect(response.status).toEqual(200);
            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
            const responseGet = await request.get('/api/users').set('Authorization', response.body.token);
            expect(responseGet.status).toEqual(403);
        });
    });
    describe('POST /', () => {
        beforeEach(async () => {
            await beforeEachCall();
        });
        afterEach(async () => {
            await User_1.User.remove({});
        });
        it('Should return 200 if the body is valid and user logged is admin', async () => {
            const response = await request.post('/api/auth').send({ identifier: admin.CPF, password: admin.password });
            expect(response.status).toEqual(200);
            // language=RegExp
            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
            const responsePost = await request.post('/api/users').set('Authorization', response.body.token).send({
                CPF: "04908861082",
                CEP: "92410535",
                password: "1234567891",
                name: "Davi Henrique3",
                house: "587",
                bairro: "Igara",
                street: "Doutor Alfredo Ângelo Filho",
                admin: false,
                roles: [],
                email: 'gm.davi.gm3@live.com'
            });
            expect(responsePost.status).toBeGreaterThanOrEqual(200);
            expect(responsePost.status).toBeLessThanOrEqual(299);
            expect(responsePost.body).toBeDefined();
            expect(responsePost.body).toHaveProperty('CPF', '04908861082');
        });
        it('Should return 400 if the body is invalid and user is logged and admin', async () => {
            const response = await request.post('/api/auth').send({ identifier: admin.CPF, password: admin.password });
            expect(response.status).toEqual(200);
            // language=RegExp
            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
            const responsePost = await request.post('/api/users').set('Authorization', response.body.token);
            expect(responsePost.status).toEqual(400);
        });
        it('Should return 401 if the user is not logged in', async () => {
            const responsePost = await request.post('/api/users');
            expect(responsePost.status).toEqual(401);
        });
        it('Should return 403 if the user is logged but not admin', async () => {
            const response = await request.post('/api/auth').send({ identifier: normalUser.CPF, password: normalUser.password });
            expect(response.status).toEqual(200);
            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
            const responsePost = await request.post('/api/users').set('Authorization', response.body.token);
            expect(responsePost.status).toEqual(403);
        });
    });
    describe('PUT /', () => {
        let userdb;
        let userdb2;
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
            userdb = new User_1.User(user);
            await userdb.save();
            userdb2 = new User_1.User(user2);
            await userdb2.save();
            normalUser = user2;
            admin = user;
        });
        afterEach(async () => {
            await User_1.User.remove({});
        });
        it('Should return 200 if the body is valid and user logged is admin', async () => {
            const response = await request.post('/api/auth').send({ identifier: admin.CPF, password: admin.password });
            expect(response.status).toEqual(200);
            // language=RegExp
            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
            const responsePut = await request.put(`/api/users/${userdb.id}`).set('Authorization', response.body.token).send({
                CPF: "04908861082",
                CEP: "92410535",
                password: "1234567891",
                name: "Davi Henrique3",
                house: "587",
                bairro: "Igara",
                street: "Doutor Alfredo Ângelo Filho",
                admin: false,
                roles: [],
                email: 'gm.davi.gm3@live.com'
            });
            expect(responsePut.status).toEqual(200);
            expect(responsePut.body).toBeDefined();
            expect(responsePut.body).toHaveProperty('CPF', '04908861080');
        });
        it('Should return 200 if the body is invalid and user is logged and admin', async () => {
            const response = await request.post('/api/auth').send({ identifier: admin.CPF, password: admin.password });
            expect(response.status).toEqual(200);
            // language=RegExp
            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
            const responsePut = await request.put(`/api/users/${userdb.id}`).set('Authorization', response.body.token);
            expect(responsePut.status).toEqual(200);
        });
        it('Should return 401 if the user is not logged in', async () => {
            const responsePut = await request.put(`/api/users/${userdb.id}`);
            expect(responsePut.status).toEqual(401);
        });
        it('Should return 403 if the user is logged but not admin', async () => {
            const response = await request.post('/api/auth').send({ identifier: normalUser.CPF, password: normalUser.password });
            expect(response.status).toEqual(200);
            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
            const responsePut = await request.put(`/api/users/${userdb.id}`).set('Authorization', response.body.token);
            expect(responsePut.status).toEqual(403);
        });
    });
    describe('DELETE /:id', () => {
        let userdb;
        let userdb2;
        beforeEach(async () => {
            await beforeEachCall();
        });
        afterEach(async () => {
            await User_1.User.remove({});
        });
        it('Should return 401 with the user is not logged in', async () => {
            const responseDelete = await request.delete('/api/users/1');
            expect(responseDelete.status).toEqual(401);
        });
        it('Should return 403 if the user is logged but not admin', async () => {
            const response = await request.post('/api/auth').send({ identifier: normalUser.CPF, password: normalUser.password });
            expect(response.status).toEqual(200);
            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
            const responseDelete = await request.delete('/api/users/1').set('Authorization', response.body.token);
            expect(responseDelete.status).toEqual(403);
        });
        it('Should return 404 if the user to be deleted does not exist', async () => {
            const response = await request.post('/api/auth').send({ identifier: admin.CPF, password: admin.password });
            expect(response.status).toEqual(200);
            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
            const responseDelete = await request.delete('/api/users/1').set('Authorization', response.body.token);
            expect(responseDelete.status).toEqual(404);
        });
    });
});
