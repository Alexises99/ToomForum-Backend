"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = exports.isString = void 0;
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
exports.isString = isString;
const isNumber = (number) => {
    return typeof number === 'number' || number instanceof Number;
};
exports.isNumber = isNumber;
