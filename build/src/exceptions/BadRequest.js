"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestException = void 0;
const HttpException_1 = __importDefault(require("./HttpException"));
class BadRequestException extends HttpException_1.default {
    constructor(msg) {
        super(400, msg);
    }
}
exports.BadRequestException = BadRequestException;
