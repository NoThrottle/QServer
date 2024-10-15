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
exports.auth = void 0;
const express_1 = require("express");
const login_1 = require("./login");
const register_1 = require("./register");
const ext_1 = require("../../../tools/ext");
const dotenv_1 = __importDefault(require("dotenv"));
const membership_1 = require("./membership/membership");
dotenv_1.default.config();
exports.auth = (0, express_1.Router)();
exports.auth.use('/membership', membership_1.membership);
exports.auth.get('/', (req, res) => {
    res.status(404);
});
exports.auth.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    const { password } = req.body;
    if (username == null || username.length < 4 || username.length > 16
        || password == null || password.length < 8) {
        return res.status(400).send((0, ext_1.Error)("Does not meet the criteria"));
    }
    let [status, hash] = yield (0, login_1.passwordLogin)(username, password);
    if (status === login_1.loginStatus.Success) {
        return res.status(200).send(JSON.stringify({ "Username": username, "Session Token": hash }));
    }
    else if (status === login_1.loginStatus.Error) {
        return res.status(503).send((0, ext_1.Error)(status));
    }
    else {
        return res.status(404).send((0, ext_1.Error)(status));
    }
}));
exports.auth.post('/sessionlogin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { "Session Token": token } = req.body;
    if (token == null) {
        return res.status(400).send((0, ext_1.Error)("Token Missing"));
    }
    let [status, resp, owner] = yield (0, login_1.sessionLogin)(token);
    if (status === login_1.loginStatus.Success) {
        return res.status(200).send(JSON.stringify({ "Username": owner, "Session Token": resp }));
    }
    else if (status === login_1.loginStatus.Error) {
        return res.status(503).send((0, ext_1.Error)(status));
    }
    else {
        return res.status(404).send((0, ext_1.Error)(status));
    }
}));
exports.auth.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    const { password } = req.body;
    const { inviteCode } = req.body;
    if (username == null || password == null || inviteCode == null) {
        return res.status(400).send((0, ext_1.Error)("Some fields are empty"));
    }
    let [status, resp] = yield (0, register_1.register)(username, password, inviteCode.toLowerCase());
    if (status === register_1.registrationStatus.Success) {
        return res.status(200).send(JSON.stringify({ "Username": username, "Session Token": resp }));
    }
    else if (status === register_1.registrationStatus.Error) {
        return res.status(503).send((0, ext_1.Error)(status));
    }
    else {
        return res.status(400).send((0, ext_1.Error)(status));
    }
}));
exports.auth.get('/publickey', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({
        "Key": ext_1.publicKey,
        "Signature": ext_1.signature
    });
}));
exports.auth.post('/rsaencrypt/:password', (req, res) => {
    const { password } = req.params;
    return res.status(200).send((0, ext_1.RSAEncrypt)(password));
});
