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
exports.updateSessionToken = exports.generateSessionToken = exports.validateToken = exports.getTokenOwner = void 0;
const crypto_1 = require("crypto");
const ext_1 = require("../../../tools/ext");
const authModels_1 = require("../models/authModels");
const firebase_1 = require("../../../tools/firebase");
/**
 * Validates the token, and if valid, returns the token's owner's username.
 * @param token
 * @returns
 */
function getTokenOwner(token) {
    return __awaiter(this, void 0, void 0, function* () {
        let b = yield firebase_1.db.collection("SessionTokens").doc(token).get();
        if (!b.exists) {
            return null;
        }
        const unixTimeSeconds = Math.floor(new Date().getTime() / 1000);
        let v = (0, authModels_1.parseSessionToken)(b);
        if (v.Expiry < unixTimeSeconds) {
            return null;
        }
        return v.Username;
    });
}
exports.getTokenOwner = getTokenOwner;
/**
 * Checks if a token exists, true if it does, and it is still valid.
 * @param token
 * @returns
 */
function validateToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const x = firebase_1.db.collection('SessionTokens').doc(token);
        const doc = yield x.get();
        const unixTimeSeconds = Math.floor(new Date().getTime() / 1000);
        if (!doc.exists) {
            return false;
        }
        let v = (0, authModels_1.parseSessionToken)(doc);
        if (v.Expiry < unixTimeSeconds) {
            return false;
        }
        return true;
    });
}
exports.validateToken = validateToken;
/**
 * Creates a new session token
 * @param username
 * @returns
 */
function generateSessionToken(username) {
    return __awaiter(this, void 0, void 0, function* () {
        let random = ((0, crypto_1.randomUUID)() + (0, crypto_1.randomUUID)());
        let hash = (0, ext_1.Get512Hash)(random);
        const unixTimeSeconds = Math.floor(new Date().getTime() / 1000);
        let token = {
            Token: hash,
            Username: username,
            Created: unixTimeSeconds,
            Updated: unixTimeSeconds,
            Expiry: unixTimeSeconds + 604800
        };
        let x;
        try {
            x = yield firebase_1.db.collection("SessionTokens").doc(hash).set(token);
        }
        catch (error) {
            console.log(error);
            return null;
        }
        return hash;
    });
}
exports.generateSessionToken = generateSessionToken;
function updateSessionToken(sessionToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const unixTimeSeconds = Math.floor(new Date().getTime() / 1000);
        try {
            yield firebase_1.db.collection("SessionTokens").doc(sessionToken).update({
                Updated: unixTimeSeconds,
                Expiry: unixTimeSeconds + 604800
            });
        }
        catch (error) {
            console.log(error);
            return null;
        }
        return sessionToken;
    });
}
exports.updateSessionToken = updateSessionToken;
