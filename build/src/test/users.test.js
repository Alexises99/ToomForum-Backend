"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const usersTestHelper_1 = __importDefault(require("../utils/tests/usersTestHelper"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const api = (0, supertest_1.default)(app_1.app);
const getToken = ({ username, password }) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api
        .post('/api/login')
        .send({ username, password });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response;
});
describe('Users tests', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield usersTestHelper_1.default.deleteUsers();
        yield usersTestHelper_1.default.createUsers();
    }));
    test('can get all users', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/);
        expect(response.body).toEqual(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        expect.arrayContaining(usersTestHelper_1.default.initialUsers.map(user => expect.objectContaining({ username: user.username }))));
    }));
    test('can add a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            username: 'monje',
            password: 'sovietmonk'
        };
        const usersAtStart = yield usersTestHelper_1.default.usersInDb();
        const response = yield api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        const usersAtEnd = yield usersTestHelper_1.default.usersInDb();
        const user = response.body;
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
        expect(usersAtEnd).toEqual(expect.arrayContaining([
            expect.objectContaining({
                username: user.username
            })
        ]));
        expect(user.username).toEqual(newUser.username);
    }));
    test('a user can get the equal user', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = usersTestHelper_1.default.initialUsers[0];
        const response = yield getToken(user);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const token = response.body.token;
        const responseApi = yield api
            .get(`/api/users/${user.username}`)
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            .set('Authorization', `bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        const { username, image_id: imageId } = user;
        expect(responseApi.body).toBeDefined();
        expect({ username, imageId }).toMatchObject(responseApi.body);
    }));
    test('400 when dont provide params and the valid message', () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            username: 'monje',
        };
        const response = yield api
            .post(`/api/users`)
            .send(newUser)
            .expect(400);
        expect(response.body.message).toBe('Incorrect or missing password undefined');
    }));
    test('400 when username is repeated', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = usersTestHelper_1.default.initialUsers[0];
        const response = yield api
            .post(`/api/users`)
            .send(user)
            .expect(400);
        expect(response.body.message).toBe('username must be unique');
    }));
    test('a user cannot get another user with a different username', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = usersTestHelper_1.default.initialUsers[0];
        const userToShow = usersTestHelper_1.default.initialUsers[1];
        const response = yield getToken(user);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const token = response.body.token;
        yield api
            .get(`/api/users/${userToShow.username}`)
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            .set('Authorization', `bearer ${token}`)
            .expect(401)
            .expect('Content-Type', /application\/json/);
    }));
    test('can delete a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = usersTestHelper_1.default.initialUsers[0];
        const responseToken = yield getToken(user);
        const token = responseToken.body.token;
        yield api
            .delete(`/api/users/${user.username}`)
            .set('Authorization', `bearer ${token}`)
            .expect(204);
    }));
    test('a different user cannot delete a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = usersTestHelper_1.default.initialUsers[0];
        const userToShow = usersTestHelper_1.default.initialUsers[1];
        const responseToken = yield getToken(user);
        const token = responseToken.body.token;
        const response = yield api
            .delete(`/api/users/${userToShow.username}`)
            .set('Authorization', `bearer ${token}`)
            .expect(401);
        expect(response.body.message).toBe('not authorized, you are not this user');
    }));
});
