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
exports.isAuthorized = exports.accessTimer = void 0;
const crypto_1 = require("crypto");
const ext_1 = require("../../../tools/ext");
const tokenService_1 = require("../auth/tokenService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accessTimerLength = parseInt(process.env.accessTimerLengthMinutes || "15");
class accessTimer {
    static accessMove() {
        console.log("Access Moved");
        for (let x in accessTimer.auth) {
            let h = accessTimer.auth[x];
            if (h.authorized == true) {
                accessTimer.auth[x].authorized == false;
            }
            else {
                accessTimer.authorized = accessTimer.authorized.filter(item => item.username != h.username);
            }
        }
        accessTimer.auth = accessTimer.auth.filter(x => x.authorized);
    }
    /**
     * Returns an access token valid for up to 15 minutes.
     * Returns null if it session token is invalid.
     * @param token
     * @returns
     */
    static authorize(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let owner = yield (0, tokenService_1.getTokenOwner)(token);
            if (owner == null) {
                return null;
            }
            let random = ((0, crypto_1.randomUUID)() + (0, crypto_1.randomUUID)());
            let hash = (0, ext_1.Get512Hash)(random);
            accessTimer.auth.push({ username: owner, accessToken: hash, authorized: true });
            accessTimer.authorized.push({ username: owner, accessToken: hash });
            return hash;
        });
    }
    static startTimer() {
        if (accessTimer.timer == null) {
            accessTimer.timer = setInterval(accessTimer.accessMove, accessTimerLength * 1000 * 60);
        }
        else {
            accessTimer.timer.ref();
        }
    }
    static stopTimer() {
        if (accessTimer.timer == null) {
            return;
        }
        else {
            accessTimer.timer.unref;
        }
    }
}
exports.accessTimer = accessTimer;
accessTimer.authorized = [];
accessTimer.auth = [];
/**
 * Returns true if the access token is valid and is owned by the username.
 * @param token
 * @param username
 * @returns
 */
function isAuthorized(token, username) {
    if (accessTimer.authorized.some(el => el.username === username && el.accessToken === token)) {
        return true;
    }
    else {
        return false;
    }
}
exports.isAuthorized = isAuthorized;
