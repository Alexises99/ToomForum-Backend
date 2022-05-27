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
const express_1 = require("express");
const users_1 = __importDefault(require("../services/users"));
const parsers_1 = require("../utils/users/parsers");
const tokens_1 = __importDefault(require("../middlewares/tokens"));
const NotAuthorized_1 = __importDefault(require("../exceptions/NotAuthorized"));
//import { User } from "../models"
const usersRouter = (0, express_1.Router)();
usersRouter.get('/', ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield users_1.default.getUsers();
    const returnedUsers = users_1.default.getNonSensitiveUserInformation(users);
    res.json(returnedUsers);
})));
usersRouter.post('/', ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUserEntry = (0, parsers_1.toNewUser)(req.body);
        const user = yield users_1.default.addUser(newUserEntry);
        res.status(201).json(user);
    }
    catch (err) {
        next(err);
    }
})));
usersRouter.get('/:username', tokens_1.default.getUserFromToken, ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.username) === req.params.username) {
            const user = yield users_1.default.getSingleUser(req.params.username);
            //res.json(usersService.getNonSensitiveUserInformation(user))
            res.json(user);
        }
        else {
            next(new NotAuthorized_1.default('not authorized, you are not this user'));
        }
    }
    catch (err) {
        next(err);
    }
})));
//Borrar entrada en islands
usersRouter.delete('/:username', tokens_1.default.getUserFromToken, ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.username) === req.params.username) {
            yield users_1.default.deleteUser(req.params.username);
            res.status(204).end();
        }
        else {
            next(new NotAuthorized_1.default('not authorized, you are not this user'));
        }
    }
    catch (err) {
        console.log(err);
    }
})));
usersRouter.put('/:username', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.updateUser(req.params.username, (0, parsers_1.toNewUser)(req.body));
        if (user) {
            res.json(users_1.default.getNonSensitiveUserInformation(user));
        }
    }
    catch (err) {
        console.log(err);
    }
})));
exports.default = usersRouter;
