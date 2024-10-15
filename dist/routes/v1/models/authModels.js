"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSessionToken = exports.parseUserMembership = exports.parseUserData = void 0;
function parseUserData(doc) {
    var _a;
    let userData = {
        HashedPW: doc.data().HashedPW,
        InviteCodeUsed: doc.data().InviteCodeUsed,
        Name: doc.data().Name,
        Pepper: doc.data().Pepper,
        Created: (_a = doc.data().Created) !== null && _a !== void 0 ? _a : 1703635200,
        UserMembership: parseUserMembership(doc.data().UserMembership)
    };
    return userData;
}
exports.parseUserData = parseUserData;
function parseUserMembership(doc) {
    let userMembership = {
        QualifiedMember: doc.QualifiedMember,
        hasErrorResponse: doc.hasErrorResponse,
        hasSubmitted: doc.hasSubmitted,
        isWelcomed: doc.isWelcomed
    };
    return userMembership;
}
exports.parseUserMembership = parseUserMembership;
function parseSessionToken(doc) {
    let token = {
        Token: doc.data().Token,
        Username: doc.data().Username,
        Created: doc.data().Created,
        Updated: doc.data().Updated,
        Expiry: doc.data().Expiry
    };
    return token;
}
exports.parseSessionToken = parseSessionToken;
