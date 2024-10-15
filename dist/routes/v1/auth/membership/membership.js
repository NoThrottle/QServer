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
exports.membership = void 0;
const firebase_1 = require("../../../../tools/firebase");
const express_1 = require("express");
const authModels_1 = require("../../models/authModels");
const tokenService_1 = require("../tokenService");
const dotenv_1 = __importDefault(require("dotenv"));
const accessTimer_1 = require("../../access/accessTimer");
dotenv_1.default.config();
exports.membership = (0, express_1.Router)();
const checkRequiredHeader = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredHeader = 'session-token';
    const token = req.headers[requiredHeader.toLowerCase()];
    if (token == null) {
        return res.status(400).send("Token Missing");
    }
    next();
});
exports.membership.use(checkRequiredHeader);
exports.membership.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = (_a = req.header("session-token")) !== null && _a !== void 0 ? _a : '';
    let owner = yield (0, tokenService_1.getTokenOwner)(token);
    if (owner == null) {
        return res.status(403).send("Unauthorized: Session Invalid or Expired");
    }
    let t = yield getMembership(owner);
    if (t == null) {
        return res.status(404).send("Unauthorized: Session Invalid or Expired");
    }
    let h = t;
    if (!h.isWelcomed || !h.QualifiedMember) {
        return res.status(402).json({
            "Membership Status": yield getMembership(owner),
            "Membership Request": (_b = yield getMembershipRequest(owner)) !== null && _b !== void 0 ? _b : null
        });
    }
    let y = yield accessTimer_1.accessTimer.authorize(token);
    if (!y) {
        return res.status(503).send("Something went wrong authorizing the user.");
    }
    return res.status(200).json({ "Access Token": y });
}));
exports.membership.post('/welcome', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const token = (_c = req.header("session-token")) !== null && _c !== void 0 ? _c : '';
    let owner = yield (0, tokenService_1.getTokenOwner)(token);
    if (owner == null) {
        return res.status(403).send("Unauthorized: Session Invalid or Expired");
    }
    let h = yield welcomeMember(owner);
    if (h) {
        return res.status(200).send();
    }
    else {
        return res.status(503).send();
    }
}));
exports.membership.post('/submitPayment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const token = (_d = req.header("session-token")) !== null && _d !== void 0 ? _d : '';
    const { "Reference Code": ref } = req.body;
    const { "Email": email } = req.body;
    let owner = yield (0, tokenService_1.getTokenOwner)(token);
    if (owner == null) {
        return res.status(403).send("Unauthorized: Session Invalid or Expired");
    }
    if (!ref || !email) {
        return res.status(400).send("Information Missing");
    }
    let g = yield getMembership(owner);
    if (g) {
        if (g.QualifiedMember) {
            return res.status(202).send("You are already a member");
        }
    }
    if (!(yield submitPayment(owner, ref, email))) {
        return res.status(503).send("Server Error");
    }
    try {
        yield firebase_1.db.collection('UserData').doc(owner).set({
            UserMembership: {
                hasSubmitted: true,
                hasErrorResponse: false
            }
        }, {
            merge: true
        });
        return res.status(200).json({
            "Membership Status": yield getMembership(owner),
            "Membership Request": yield getMembershipRequest(owner)
        });
    }
    catch (_e) {
        return res.status(503).send("Server Error");
    }
}));
function getMembershipRequest(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const x = firebase_1.db.collection('MembershipRequest').doc(username);
        const doc = yield x.get();
        if (!doc.exists) {
            return null;
        }
        return doc.data();
    });
}
function getMembership(username) {
    return __awaiter(this, void 0, void 0, function* () {
        const x = firebase_1.db.collection('UserData').doc(username);
        const doc = yield x.get();
        if (!doc.exists) {
            return null;
        }
        let h = (0, authModels_1.parseUserData)(doc);
        return h.UserMembership;
    });
}
function submitPayment(username, ref, email) {
    return __awaiter(this, void 0, void 0, function* () {
        let req = {
            Email: email,
            ReferenceCode: ref,
            Username: username
        };
        try {
            yield firebase_1.db.collection('MembershipRequest').doc(username).set(req);
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    });
}
function welcomeMember(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield firebase_1.db.collection('UserData').doc(username).set({
                UserMembership: {
                    isWelcomed: true,
                }
            }, {
                merge: true
            });
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    });
}
