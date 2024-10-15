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
exports.getStatistics = void 0;
const firebase_1 = require("../../../tools/firebase");
const express_1 = __importDefault(require("express"));
exports.getStatistics = express_1.default.Router();
exports.getStatistics.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = req.query.date;
    res.setHeader("Content-Type", "application/json");
    if (date == null || date.length === 0) {
        res.status(200).send(yield getStatsFromToday());
    }
    else {
        let get = yield getStatsFromDate(date.toString());
        if (get === null) {
            res.status(404).send("Invalid Date");
        }
        else {
            res.status(200).send(get);
        }
    }
}));
function getStatsFromToday() {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0'); // Ensures two digits
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = now.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        return yield getStatsFromDate(formattedDate);
    });
}
function getStatsFromDate(date) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function* () {
        const curr = yield firebase_1.db.collection("Historical Statistics").doc(date).get();
        if (!curr.exists) {
            return null;
        }
        else {
            let a = curr.data();
            let q = [];
            if (a.Queued) {
                for (let i = 0; i <= 23; i++) {
                    let hourKey = i.toString().padStart(2, '0') + "00";
                    if (a.Queued[hourKey] !== undefined) {
                        q.push(a.Queued[hourKey]);
                    }
                    else {
                        q.push(-1);
                    }
                }
            }
            else {
                q = Array(24).fill(-1);
            }
            let p = [];
            if (a.Processed) {
                for (let i = 0; i <= 23; i++) {
                    let hourKey = i.toString().padStart(2, '0') + "00";
                    if (a.Processed[hourKey] !== undefined) {
                        p.push(a.Processed[hourKey]);
                    }
                    else {
                        p.push(-1);
                    }
                }
            }
            else {
                p = Array(24).fill(-1);
            }
            let c = [];
            if (a.Completed) {
                for (let i = 0; i <= 23; i++) {
                    let hourKey = i.toString().padStart(2, '0') + "00";
                    if (a.Completed[hourKey] !== undefined) {
                        c.push(a.Completed[hourKey]);
                    }
                    else {
                        c.push(-1);
                    }
                }
            }
            else {
                c = Array(24).fill(-1);
            }
            let Stats = {
                total: {
                    Queued: (_b = (_a = a.Queued) === null || _a === void 0 ? void 0 : _a.total) !== null && _b !== void 0 ? _b : 0,
                    Processed: (_d = (_c = a.Processed) === null || _c === void 0 ? void 0 : _c.total) !== null && _d !== void 0 ? _d : 0,
                    Completed: (_f = (_e = a.Completed) === null || _e === void 0 ? void 0 : _e.total) !== null && _f !== void 0 ? _f : 0,
                    Backlog: (_g = a.Backlog) !== null && _g !== void 0 ? _g : 0
                },
                hourly: {
                    Queued: q,
                    Processed: p,
                    Completed: c
                }
            };
            return JSON.stringify(Stats);
        }
    });
}
