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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../../models");
const initalImage = {
    name: 'test image',
    data: Buffer.from('this is a test')
};
const getImagesFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const images = yield models_1.Image.findAll();
    return images;
});
const createImages = () => __awaiter(void 0, void 0, void 0, function* () {
    const image = yield models_1.Image.create(initalImage);
    return image;
});
const deleteImages = () => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.Image.destroy({
        where: {},
        truncate: false
    });
});
exports.default = {
    initalImage,
    getImagesFromDb,
    createImages,
    deleteImages
};
