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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionLogin = exports.passwordLogin = exports.loginStatus = void 0;
const firebase_1 = require("../../../tools/firebase");
const ext_1 = require("../../../tools/ext");
const tokenService_1 = require("./tokenService");
var loginStatus;
(function (loginStatus) {
    loginStatus["Success"] = "Succesfully Logged In";
    loginStatus["NotFound"] = "User not found";
    loginStatus["IncorrectPassword"] = "Incorrect password";
    loginStatus["Error"] = "Error";
    loginStatus["Expired"] = "Session Expired";
})(loginStatus || (exports.loginStatus = loginStatus = {}));
function passwordLogin(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const x = firebase_1.db.collection('UserData').doc(username);
        const doc = yield x.get();
        if (!doc.exists) {
            return [loginStatus.NotFound, null];
        }
        let decrypted;
        try {
            decrypted = (0, ext_1.RSADecrypt)(password);
        }
        catch (error) {
            console.log(error);
            return [loginStatus.IncorrectPassword, null];
        }
        let Pepper = doc.data().Pepper;
        let storedHash = doc.data().HashedPW;
        let hasha = (0, ext_1.Get512Hash)(Pepper + decrypted + ext_1.salt);
        if (hasha !== storedHash) {
            return [loginStatus.IncorrectPassword, null];
        }
        let token = yield (0, tokenService_1.generateSessionToken)(username);
        if (token == null) {
            return [loginStatus.Error, null];
        }
        return [loginStatus.Success, token];
    });
}
exports.passwordLogin = passwordLogin;
function sessionLogin(SessionKey) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, tokenService_1.validateToken)(SessionKey)) {
            return [loginStatus.Expired, null, null];
        }
        let y = yield (0, tokenService_1.updateSessionToken)(SessionKey);
        if (y == null) {
            return [loginStatus.Error, null, null];
        }
        let owner = yield (0, tokenService_1.getTokenOwner)(SessionKey);
        if (!owner) {
            return [loginStatus.Error, null, null];
        }
        return [loginStatus.Success, SessionKey, owner];
    });
}
exports.sessionLogin = sessionLogin;
