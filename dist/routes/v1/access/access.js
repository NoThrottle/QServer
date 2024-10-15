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
exports.access = void 0;
const express_1 = __importDefault(require("express"));
const accessTimer_1 = require("./accessTimer");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.access = express_1.default.Router();
const ratelimits = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 5,
    message: "You have exceeded the rate limit for creating access tokens.",
    headers: true
});
exports.access.use(ratelimits);
exports.access.post('/newToken', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { "Session Token": token } = req.body;
    if (!token) {
        return res.status(400).send("Token Missing");
    }
    let accessToken = yield accessTimer_1.accessTimer.authorize(token);
    if (accessToken == null) {
        return res.status(404).send("Token Invalid or Expired");
    }
    return res.status(200).json({ "Access Token": accessToken }).send();
}));
