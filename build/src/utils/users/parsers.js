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
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewUser = void 0;
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const exceptions_1 = require("../../exceptions");
const check = __importStar(require("../checkers"));
const toNewUser = (object) => {
    const toNewUser = {
        username: parseUsername(object.username),
        password: parsePassword(object.password),
        image_id: parseImageId(object.imageId)
    };
    return toNewUser;
};
exports.toNewUser = toNewUser;
const parseUsername = (username) => {
    if (!username || !check.isString(username)) {
        throw new exceptions_1.BadRequestException(`Incorrect or missing username ${username}`);
    }
    return username;
};
const parsePassword = (password) => {
    if (!password || !check.isString(password)) {
        throw new exceptions_1.BadRequestException(`Incorrect or missing password ${password}`);
    }
    return password;
};
const parseImageId = (imageId) => {
    if (!imageId || !check.isNumber(imageId)) {
        return null;
    }
    return imageId;
};
