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
exports.getInvitedList = void 0;
const firebase_1 = require("../../../tools/firebase");
function getInvitedList(username) {
    return __awaiter(this, void 0, void 0, function* () {
        var list = yield firebase_1.db.collection('UserData').doc(username).collection('Invited').get();
        var invited = [];
        list.forEach((x) => {
            invited.push(x.data().Username);
        });
        return invited;
    });
}
exports.getInvitedList = getInvitedList;
