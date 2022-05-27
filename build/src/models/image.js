"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../utils/db");
class Image extends sequelize_1.Model {
}
exports.Image = Image;
Image.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    data: {
        type: sequelize_1.DataTypes.BLOB
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    }
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'image',
});
