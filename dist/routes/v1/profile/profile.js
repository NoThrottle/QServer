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
exports.profile = void 0;
const express_1 = __importDefault(require("express"));
const accessTimer_1 = require("../access/accessTimer");
const invite_1 = require("./invite");
const invitecode_1 = require("../auth/invitecode");
const verifyEmail_1 = require("./verifyEmail");
const donate_1 = require("./donate");
exports.profile = express_1.default.Router();
const checkAccessToken = (req, res, next) => {
    const _accessToken = 'access-token';
    const _username = 'username';
    const accessToken = req.headers[_accessToken] || '';
    const username = req.headers[_username] || '';
    if (!accessToken || !username) {
        return res.status(403).send("Access Token or Username is required");
    }
    if (!(0, accessTimer_1.isAuthorized)(accessToken, username)) {
        return res.status(403).send("Unauthorized: Bad Access Key or Wrong actor");
    }
    next();
};
exports.profile.use(checkAccessToken);
exports.profile.get('/invitedlist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const username = (_a = req.header('username')) !== null && _a !== void 0 ? _a : '';
    return res.status(200).json(yield (0, invite_1.getInvitedList)(username));
}));
exports.profile.get('/createInviteCode', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const username = (_b = req.header('username')) !== null && _b !== void 0 ? _b : '';
    let x;
    let Code;
    let Expiry;
    try {
        x = yield (0, invitecode_1.createInviteCode)(username);
        [Code, Expiry] = x;
    }
    catch (error) {
        return res.status(503).send();
    }
    if (!Code && !Expiry) {
        return res.status(503).send();
    }
    return res.status(200).json({ "Invite Code": Code, "Expiry": Expiry });
}));
exports.profile.post('/donate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const username = (_c = req.header('username')) !== null && _c !== void 0 ? _c : '';
    const { referenceCode } = req.body;
    if (!referenceCode) {
        return res.status(400).send("Missing reference code");
    }
    let h = yield (0, donate_1.donate)(username, referenceCode);
    if (!h) {
        return res.status(503).send("Unable to fulfill request");
    }
    return res.status(200).json(h);
}));
exports.profile.get('/pendingDonations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const username = (_d = req.header('username')) !== null && _d !== void 0 ? _d : '';
    return res.status(200).json(yield (0, donate_1.getPendingDonations)(username));
}));
exports.profile.get('/verifiedDonations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const username = (_e = req.header('username')) !== null && _e !== void 0 ? _e : '';
    return res.status(200).json(yield (0, donate_1.getVerifiedDonations)(username));
}));
exports.profile.get('/verifyEmail', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const username = (_f = req.header('username')) !== null && _f !== void 0 ? _f : '';
    const { destinationEmail } = req.body;
    if (!destinationEmail) {
        return res.status(400).send("need destination email");
    }
    let x;
    yield (0, verifyEmail_1.sendVerificationEmail)(destinationEmail, username, "https://nothrottle.com");
    return res.status(200).send("meow");
}));
