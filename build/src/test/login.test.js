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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const usersTestHelper_1 = __importDefault(require("../utils/tests/usersTestHelper"));
const api = (0, supertest_1.default)(app_1.app);
const getToken = ({ username, password }) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api
        .post('/api/login')
        .send({ username, password });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return response;
});
describe('login works properly', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield usersTestHelper_1.default.deleteUsers();
        yield usersTestHelper_1.default.createUsers();
    }));
    test('Invaled token returns 401 and the valid message', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = usersTestHelper_1.default.initialUsers[0];
        const responseToken = yield getToken(user);
        const token = responseToken.body.token;
        const response = yield api
            .get(`/api/users/${user.username}`)
            .set('Authorization', `bearer ${token.substring(2)}`)
            .expect(401)
            .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('invalid token');
    }));
    test('Invalid username or password returns 401 and the valid message', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = usersTestHelper_1.default.initialUsers[0];
        user.password = 'aaaa';
        const response = yield api
            .post(`/api/login`)
            .send(user)
            .expect(401)
            .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('invalid username or password');
    }));
    test('a valid user recive token', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = usersTestHelper_1.default.initialUsers[2];
        const responseToken = yield getToken(user);
        const token = responseToken.body.token;
        const response = yield api
            .post(`/api/login`)
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        expect(response.body.token).toBe(token);
    }));
    test('missing token throws apropiate erros', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api
            .get(`/api/users/ubuntin`)
            .expect(401)
            .expect('Content-Type', /application\/json/);
        expect(response.body.message).toBe('Missing token');
    }));
});
