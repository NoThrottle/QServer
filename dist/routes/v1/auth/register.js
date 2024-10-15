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
exports.register = exports.registrationStatus = void 0;
const firebase_1 = require("../../../tools/firebase");
const ext_1 = require("../../../tools/ext");
const tokenService_1 = require("./tokenService");
const invitecode_1 = require("./invitecode");
var registrationStatus;
(function (registrationStatus) {
    registrationStatus["Success"] = "Succesfully Registered";
    registrationStatus["UsernameExists"] = "Username is already used.";
    registrationStatus["BadNameLength"] = "Username must be between 6 and 16 characters long.";
    registrationStatus["IllegalName"] = "Username must only contain alphanumerics or an underscore.";
    registrationStatus["TooManyUnderscores"] = "Username cannot contain consecutive underscores.";
    registrationStatus["NameSecurityIssue"] = "You cannot set your name like that.";
    registrationStatus["BadPasswordLength"] = "Password must be between 8 and 16 characters long.";
    registrationStatus["IllegalPassword"] = "Password cannot contain brackets, chevrons, and semi-colons";
    registrationStatus["PasswordSecurityIssue"] = "You cannot set your password like that.";
    registrationStatus["BadInviteCode"] = "Invite code is expired or doesn't exist.";
    registrationStatus["Error"] = "Error accomplishing request. Try logging in to see if the account was created.";
})(registrationStatus || (exports.registrationStatus = registrationStatus = {}));
function register(username, password, inviteCode) {
    return __awaiter(this, void 0, void 0, function* () {
        let criteriaErrors = [];
        //Username
        if (username.length < 6 || username.length > 16 || username == null) {
            criteriaErrors.push(registrationStatus.BadNameLength);
        }
        if (username === "undefined" || username === "null" || username === "function") {
            criteriaErrors.push(registrationStatus.NameSecurityIssue);
        }
        if (!username.isAlphanumericUnderscore()) {
            criteriaErrors.push(registrationStatus.IllegalName);
        }
        const regex = /__/;
        if (regex.test(username)) {
            criteriaErrors.push(registrationStatus.TooManyUnderscores);
        }
        //Password
        let ps = (0, ext_1.RSADecrypt)(password);
        if (ps.length < 8 || ps.length > 16) {
            criteriaErrors.push(registrationStatus.BadPasswordLength);
        }
        const reg2 = /[()<>[\]{};]/;
        if (reg2.test(ps)) {
            criteriaErrors.push(registrationStatus.IllegalPassword);
        }
        if (ps === "undefined" || ps === "null" || ps === "function") {
            criteriaErrors.push(registrationStatus.PasswordSecurityIssue);
        }
        //If those aren't fulfilled, no longer check database
        if (criteriaErrors.length > 0) {
            return [criteriaErrors, null];
        }
        //Continue
        const x = firebase_1.db.collection('UserData');
        const col = yield x.get();
        let usernameExists = false;
        col.forEach((el) => {
            if (String(el.data().Name).toLowerCase() == username.toLowerCase()) {
                usernameExists = true;
            }
        });
        if (usernameExists) {
            return [[registrationStatus.UsernameExists], null];
        }
        if (!(yield (0, invitecode_1.consumeInviteCode)(inviteCode, username))) {
            return [[registrationStatus.BadInviteCode], null];
        }
        //If good then continue
        let pepper = (0, ext_1.generatePepper)();
        let hash = (0, ext_1.Get512Hash)(pepper + ps + ext_1.salt);
        let userMem = {
            QualifiedMember: false,
            hasErrorResponse: false,
            hasSubmitted: false,
            isWelcomed: false
        };
        let user = {
            Name: username,
            HashedPW: hash,
            Pepper: pepper,
            InviteCodeUsed: inviteCode,
            Created: Math.floor(new Date().getTime() / 1000),
            UserMembership: userMem,
        };
        try {
            yield firebase_1.db.collection('UserData').doc(username).set(user);
        }
        catch (error) {
            console.log(error);
            return [registrationStatus.Error, null];
        }
        let token = yield (0, tokenService_1.generateSessionToken)(username);
        if (token == null) {
            return [registrationStatus.Error, null];
        }
        return [registrationStatus.Success, token];
    });
}
exports.register = register;
