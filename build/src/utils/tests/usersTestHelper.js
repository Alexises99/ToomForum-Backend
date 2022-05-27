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
const models_1 = require("../../models");
const bcrypt = __importStar(require("bcrypt"));
const initialUsers = [
    {
        username: 'elubuntin',
        password: 'pinguino',
        image_id: null
    },
    {
        username: 'lowrins',
        password: 'tortuga',
        image_id: null
    },
    {
        username: 'ranaldo',
        password: 'culero',
        image_id: null
    },
];
const usersInDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield models_1.User.findAll();
    return users;
});
const createUsers = () => {
    const createdUsers = initialUsers.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        const password = yield bcrypt.hash(user.password, 10);
        return yield models_1.User.create({ username: user.username, password, imageId: null });
    }));
    return Promise.all(createdUsers);
};
const deleteUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.User.destroy({
        where: {},
        truncate: false
    });
});
exports.default = {
    initialUsers,
    usersInDb,
    createUsers,
    deleteUsers
};
