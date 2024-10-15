"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1 = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("./auth/auth");
const access_1 = require("./access/access");
const profile_1 = require("./profile/profile");
const launcher_1 = require("./launcher/launcher");
exports.v1 = express_1.default.Router();
exports.v1.get('/', (req, res) => {
    res.status(200).send("v1 Active");
});
exports.v1.use('/auth', auth_1.auth);
exports.v1.use('/access', access_1.access);
exports.v1.use('/profile', profile_1.profile);
exports.v1.use('/launcher', launcher_1.launcher);
