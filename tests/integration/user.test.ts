import {User, UserSchema} from "../../models/User";
import {app} from "../../app";
import * as response from "supertest";

describe('User REST API', () => {
    let admin: UserSchema;
    let normalUser: UserSchema;

    const request = response.agent(app);

    async function beforeEachCall() : Promise<void> {
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
            complement: "",
            bairro: "Igara",
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
    }

    describe('GET /', () => {

        beforeEach(async () : Promise<void> => {
           await beforeEachCall();
        });


        afterEach(async () : Promise<void> => {
            await User.remove({});
        });

        it('Should return all users if User is admin and logged in', async () : Promise<void> => {
            const response = await request.post('/api/auth').send({identifier: admin.CPF, password: admin.password});

            expect(response.status).toEqual(200);

            // language=RegExp
            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);

            const responseGet = await request.get('/api/users').set('Authorization', response.body.token);

            expect(responseGet.status).toEqual(200);
            expect(responseGet.body).toBeDefined();
            expect(responseGet.body.length).toEqual(2);
        });

        it('Should return 401 if the user is not logged in', async () : Promise<void> => {
            const responseGet = await request.get('/api/users');

            expect(responseGet.status).toEqual(401);
        });

        it('Should return 403 if the user is logged but not admin', async () : Promise<void> => {
            const response = await request.post('/api/auth').send({identifier: normalUser.CPF, password: normalUser.password});

            expect(response.status).toEqual(200);

            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);

            const responseGet = await request.get('/api/users').set('Authorization', response.body.token);

            expect(responseGet.status).toEqual(403);
        });



    });

    describe('POST /', () => {

        beforeEach(async () : Promise<void> => {
            await beforeEachCall();
        });


        afterEach(async () : Promise<void> => {
            await User.remove({});
        });

        it('Should return 200 if the body is valid and user logged is admin', async () : Promise<void> => {
            const response = await request.post('/api/auth').send({identifier: admin.CPF, password: admin.password});

            expect(response.status).toEqual(200);

            // language=RegExp
            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);

            const responsePost = await request.post('/api/users').set('Authorization', response.body.token).send({
                CPF: "04908861082",
                CEP: "92410535",
                password: "1234567891",
                name: "Davi Henrique3",
                house: "587",
                complement: "",
                bairro: "Igara",
                street: "Doutor Alfredo Ângelo Filho",
                admin: false,
                roles: [],
                email: 'gm.davi.gm3@live.com'
            });

            expect(responsePost.status).toBeGreaterThanOrEqual(200);
            expect(responsePost.status).toBeLessThanOrEqual(299);
            expect(responsePost.body).toBeDefined();
            expect(responsePost.body).toHaveProperty('CPF', '04908861082')
        });

        it('Should return 400 if the body is invalid and user is logged and admin', async () : Promise<void> => {
            const response = await request.post('/api/auth').send({identifier: admin.CPF, password: admin.password});

            expect(response.status).toEqual(200);

            // language=RegExp
            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);

            const responsePost = await request.post('/api/users').set('Authorization', response.body.token);

            expect(responsePost.status).toEqual(400);
        });

        it('Should return 401 if the user is not logged in', async () : Promise<void> => {
            const responsePost = await request.post('/api/users');

            expect(responsePost.status).toEqual(401);
        });


        it('Should return 403 if the user is logged but not admin', async () : Promise<void> => {
            const response = await request.post('/api/auth').send({identifier: normalUser.CPF, password: normalUser.password});

            expect(response.status).toEqual(200);

            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);

            const responsePost = await request.post('/api/users').set('Authorization', response.body.token);

            expect(responsePost.status).toEqual(403);
        });

    });

    describe('PUT /', () => {

        let userdb;
        let userdb2;

        beforeEach(async () : Promise<void> => {
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
                complement: "",
                bairro: "Igara",
                street: "Doutor Alfredo Ângelo Filho",
                admin: false,
                roles: [],
                email: 'gm.davi.gm2@live.com'
            };

            userdb = new User(user);
            await userdb.save();

            userdb2 = new User(user2);
            await userdb2.save();

            normalUser = user2;
            admin = user;
        });


        afterEach(async () : Promise<void> => {
            await User.remove({});
        });

        it('Should return 200 if the body is valid and user logged is admin', async () : Promise<void> => {
            const response = await request.post('/api/auth').send({identifier: admin.CPF, password: admin.password});

            expect(response.status).toEqual(200);

            // language=RegExp
            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);

            const responsePut = await request.put(`/api/users/${userdb.id}`).set('Authorization', response.body.token).send({
                CPF: "04908861082",
                CEP: "92410535",
                password: "1234567891",
                name: "Davi Henrique3",
                house: "587",
                complement: "",
                bairro: "Igara",
                street: "Doutor Alfredo Ângelo Filho",
                admin: false,
                roles: [],
                email: 'gm.davi.gm3@live.com'
            });

            expect(responsePut.status).toEqual(200);
            expect(responsePut.body).toBeDefined();
            expect(responsePut.body).toHaveProperty('CPF', '04908861080')
        });

        it('Should return 200 if the body is invalid and user is logged and admin', async () : Promise<void> => {
            const response = await request.post('/api/auth').send({identifier: admin.CPF, password: admin.password});

            expect(response.status).toEqual(200);

            // language=RegExp
            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);

            const responsePut = await request.put(`/api/users/${userdb.id}`).set('Authorization', response.body.token);

            expect(responsePut.status).toEqual(200);
        });

        it('Should return 401 if the user is not logged in', async () : Promise<void> => {
            const responsePut = await request.put(`/api/users/${userdb.id}`);

            expect(responsePut.status).toEqual(401);
        });


        it('Should return 403 if the user is logged but not admin', async () : Promise<void> => {
            const response = await request.post('/api/auth').send({identifier: normalUser.CPF, password: normalUser.password});

            expect(response.status).toEqual(200);

            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);

            const responsePut = await request.put(`/api/users/${userdb.id}`).set('Authorization', response.body.token);

            expect(responsePut.status).toEqual(403);
        });

    });

    describe('DELETE /:id', () => {

        let userdb;
        let userdb2;

        beforeEach(async () : Promise<void> => {
           await beforeEachCall();
        });


        afterEach(async () : Promise<void> => {
            await User.remove({});
        });

        it('Should return 401 with the user is not logged in', async () : Promise<void> => {
            const responseDelete = await request.delete('/api/users/1');

            expect(responseDelete.status).toEqual(401);
        });

        it('Should return 403 if the user is logged but not admin', async () : Promise<void> => {
            const response = await request.post('/api/auth').send({identifier: normalUser.CPF, password: normalUser.password});

            expect(response.status).toEqual(200);

            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);

            const responseDelete = await request.delete('/api/users/1').set('Authorization', response.body.token);

            expect(responseDelete.status).toEqual(403);
        });

        it('Should return 404 if the user to be deleted does not exist', async () : Promise<void> => {
            const response = await request.post('/api/auth').send({identifier: admin.CPF, password: admin.password});

            expect(response.status).toEqual(200);

            expect(response.body.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);

            const responseDelete = await request.delete('/api/users/1').set('Authorization', response.body.token);

            expect(responseDelete.status).toEqual(404);
        });


    });

});