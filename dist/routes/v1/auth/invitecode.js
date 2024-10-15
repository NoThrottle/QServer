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
exports.consumeInviteCode = exports.createInviteCode = void 0;
const firebase_1 = require("../../../tools/firebase");
const ext_1 = require("../../../tools/ext");
function createInviteCode(username) {
    return __awaiter(this, void 0, void 0, function* () {
        let code = (0, ext_1.generateRandomHexString)(12);
        let date = Math.floor(new Date().getTime() / 1000);
        let expiry = date + 86400;
        let entry = {
            Owner: username,
            DateCreated: date,
            DateExpiry: expiry
        };
        try {
            yield firebase_1.db.collection('InviteCodes').doc(code).set(entry);
        }
        catch (error) {
            console.log(error);
            return null;
        }
        return [code, expiry];
    });
}
exports.createInviteCode = createInviteCode;
/**
 * Function to use an invite code, also checks if it exists.
 * @param code The invite code
 * @returns True if it was able to consume, false if not
 */
function consumeInviteCode(code, username) {
    return __awaiter(this, void 0, void 0, function* () {
        const x = firebase_1.db.collection('InviteCodes').doc(code);
        const doc = yield x.get();
        if (!doc.exists) {
            return false;
        }
        if (doc.data().DateExpiry < Math.floor(new Date().getTime() / 1000)) {
            return false;
        }
        if (!(yield addToInvited(doc.data().Owner, username, code))) {
            return false;
        }
        try {
            yield firebase_1.db.collection('InviteCodes').doc(code).delete();
        }
        catch (_a) {
            return false;
        }
        return true;
    });
}
exports.consumeInviteCode = consumeInviteCode;
function addToInvited(invitee, username, code) {
    return __awaiter(this, void 0, void 0, function* () {
        let m = {
            Username: username,
            Code: code,
            Date: Math.floor(new Date().getTime() / 1000)
        };
        try {
            yield firebase_1.db.collection('UserData').doc(invitee).collection('Invited').doc(username).set(m);
        }
        catch (_a) {
            return false;
        }
        return true;
    });
}
