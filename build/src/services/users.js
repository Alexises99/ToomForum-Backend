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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const exceptions_1 = require("../exceptions");
const models_1 = require("../models");
const bcrypt = __importStar(require("bcrypt"));
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield models_1.User.findAll();
    return users;
});
const getNonSensitiveUserInformation = (users) => {
    if (users instanceof Array) {
        return users.map(user => {
            return {
                username: user.username,
            };
        });
    }
    else {
        return {
            username: users.username,
        };
    }
};
const getSingleUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.User.findByPk(username, {
        attributes: { exclude: ['password'] }
    });
    if (user) {
        return user;
    }
    throw new exceptions_1.NotFoundException(username);
});
const addUser = (newUserEntry) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const saltRounds = 10;
        newUserEntry.password = yield bcrypt.hash(newUserEntry.password, saltRounds);
        const image = yield models_1.Image.findByPk(newUserEntry.image_id);
        const user = yield models_1.User.create(Object.assign(Object.assign({}, newUserEntry), { imageId: image === null || image === void 0 ? void 0 : image.id }));
        return user;
    }
    catch (err) {
        if (err instanceof sequelize_1.UniqueConstraintError) {
            const msg = err.errors.map(err => err.message).join(',');
            throw new exceptions_1.BadRequestException(msg);
        }
        else if (err instanceof sequelize_1.ValidationError) {
            const msg = err.errors.map(err => err.message).join(',');
            throw new exceptions_1.BadRequestException(msg);
        }
        else {
            throw new Error();
        }
    }
});
const deleteUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getSingleUser(username);
    if (user) {
        yield user.destroy();
        return true;
    }
    return false;
});
const updateUser = (username, newUserEntry) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getSingleUser(username);
    if (user) {
        user.password = newUserEntry.password;
        yield user.save();
        return user;
    }
    return null;
});
exports.default = {
    getUsers,
    getSingleUser,
    addUser,
    deleteUser,
    updateUser,
    getNonSensitiveUserInformation
};
