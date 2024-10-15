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
exports.LogType = exports.incrementCurrentHour = void 0;
const firebase_1 = require("../../tools/firebase");
function incrementCurrentHour(type) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0'); // Ensures two digits
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = now.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        const hours = String(now.getHours()).padStart(2, '0'); // Get the hour in two digits
        const formattedHour = `${hours}00`;
        const curr = firebase_1.db.collection("Historical Statistics").doc(formattedDate);
        const obtained = yield curr.get();
        let typeText = LogType[type];
        if (!obtained.exists) {
            curr.set({
                [typeText]: {
                    [formattedHour]: 1,
                    total: 1
                }
            });
        }
        else {
            let hour = (_a = obtained.data()[typeText]) === null || _a === void 0 ? void 0 : _a[formattedHour];
            if (hour !== undefined) {
                curr.update({
                    [`${typeText}.${formattedHour}`]: (hour + 1)
                });
            }
            else {
                yield curr.update({
                    [`${typeText}.${formattedHour}`]: 1 // Initialize this hour
                });
            }
            let total = (_b = obtained.data()[typeText]) === null || _b === void 0 ? void 0 : _b.total;
            if (total !== undefined) {
                curr.update({
                    [`${typeText}.total`]: (total + 1)
                });
            }
            else {
                yield curr.update({
                    [`${typeText}.total`]: 1
                });
            }
        }
    });
}
exports.incrementCurrentHour = incrementCurrentHour;
var LogType;
(function (LogType) {
    LogType[LogType["Queued"] = 0] = "Queued";
    LogType[LogType["Completed"] = 1] = "Completed";
    LogType[LogType["Processed"] = 2] = "Processed";
})(LogType || (exports.LogType = LogType = {}));
