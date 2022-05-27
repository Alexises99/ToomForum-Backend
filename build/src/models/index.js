"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Island = exports.Image = exports.User = void 0;
const island_1 = require("./island");
Object.defineProperty(exports, "Island", { enumerable: true, get: function () { return island_1.Island; } });
const user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
const image_1 = require("./image");
Object.defineProperty(exports, "Image", { enumerable: true, get: function () { return image_1.Image; } });
image_1.Image.hasOne(user_1.User);
user_1.User.belongsTo(image_1.Image);
void image_1.Image.sync({ alter: true });
void user_1.User.sync({ alter: true });
void island_1.Island.sync({ alter: true });
