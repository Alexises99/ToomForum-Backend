"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = require("express");
const models_1 = require("../models");
const parsers_1 = require("../utils/users/parsers");
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../utils/config"));
const NotAuthorized_1 = __importDefault(require("../exceptions/NotAuthorized"));
const loginRouter = (0, express_1.Router)();
loginRouter.post('/', ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = (0, parsers_1.toNewUser)(req.body);
    const user = yield models_1.User.findOne({
        where: {
            username: body.username
        }
    });
    const passwordCorrect = user === null
        ? false
        : yield bcrypt.compare(body.password, user.password);
    if (!(passwordCorrect && user)) {
        next(new NotAuthorized_1.default('invalid username or password'));
        return;
    }
    const userForToken = {
        username: user.username,
        image_id: user.imageId
    };
    const username = userForToken.username;
    const imageId = userForToken.image_id;
    const token = jsonwebtoken_1.default.sign(userForToken, config_1.default.SECRET);
    return res
        .status(200)
        .json({ token, username, imageId });
})));
exports.default = loginRouter;
