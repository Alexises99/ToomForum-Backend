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
const express_1 = require("express");
const BadRequest_1 = require("../exceptions/BadRequest");
const images_1 = __importDefault(require("../services/images"));
const NotFound_1 = __importDefault(require("../exceptions/NotFound"));
const imageRouter = (0, express_1.Router)();
imageRouter.post("/", ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.files) {
        const err = new BadRequest_1.BadRequestException("No files were uploaded");
        next(err);
    }
    const image = (_a = req.files) === null || _a === void 0 ? void 0 : _a.profileImage;
    if (image) {
        const { name, data } = image;
        const imageSaved = yield images_1.default.create({ data, name });
        res.status(201).json({ imageId: imageSaved.id });
    }
})));
imageRouter.get("/:id", ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!+req.params.id) {
        console.log("Usuario sin imagen asociada");
        return;
    }
    const image = yield images_1.default.getOne(+req.params.id);
    if (image) {
        res.status(200).end(image.data);
    }
    else {
        next(new NotFound_1.default(`Image with id: ${req.params.id} not found`));
    }
})));
exports.default = imageRouter;
