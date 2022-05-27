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
const imageTestHelper_1 = __importDefault(require("../utils/tests/imageTestHelper"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const api = (0, supertest_1.default)(app_1.app);
describe('image test', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield imageTestHelper_1.default.deleteImages();
        yield imageTestHelper_1.default.createImages();
    }));
    test('can get one image', () => __awaiter(void 0, void 0, void 0, function* () {
        const images = yield imageTestHelper_1.default.getImagesFromDb();
        const image = images[0];
        console.log(image.id);
        const response = yield api
            .get(`/api/images/${image.id}`)
            .expect(200);
        console.log(response);
        expect(response.body).toBeDefined();
    }));
    test.skip('cand add a new image', () => __awaiter(void 0, void 0, void 0, function* () {
        const imageToAdd = {
            name: 'hola',
            data: Buffer.from('holaaa')
        };
        const response = yield api
            .post('/api/images')
            .send(imageToAdd)
            .expect(201);
        expect(response.body).toEqual(imageToAdd);
    }));
});
