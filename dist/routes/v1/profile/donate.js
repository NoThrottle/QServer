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
exports.getVerifiedDonations = exports.getPendingDonations = exports.donate = void 0;
const firebase_1 = require("../../../tools/firebase");
function donate(username, referenceCode) {
    return __awaiter(this, void 0, void 0, function* () {
        let now = new Date().getTime();
        let donation = {
            username: username,
            referenceCode: referenceCode,
            creationTimestamp: now
        };
        try {
            yield firebase_1.db.collection('Donations').doc(now.toString()).set(donation);
            yield firebase_1.db.collection('UserData').doc(username).collection('PendingDonations').doc(now.toString()).set(donation);
            return donation;
        }
        catch (e) {
            console.error(e);
            return null;
        }
    });
}
exports.donate = donate;
function getPendingDonations(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const x = yield firebase_1.db.collection('UserData').doc(username).collection('PendingDonations').get();
        if (x.empty || !x || x == undefined) {
            return [];
        }
        let g = [];
        x.forEach((el) => {
            g.push(el.data());
        });
        return g;
    });
}
exports.getPendingDonations = getPendingDonations;
function getVerifiedDonations(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const x = yield firebase_1.db.collection('UserData').doc(username).collection('VerifiedDonations').get();
        if (x.empty || !x || x == undefined) {
            return [];
        }
        let g = [];
        x.forEach((el) => {
            g.push(el.data());
        });
        return g;
    });
}
exports.getVerifiedDonations = getVerifiedDonations;
