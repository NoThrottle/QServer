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
exports.invoice = void 0;
const ManageStats_1 = require("../../../tools/Jobs/ManageStats");
const firebase_1 = require("../../../tools/firebase");
const express_1 = __importDefault(require("express"));
exports.invoice = express_1.default.Router();
exports.invoice.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { InvoiceID } = req.body;
    const { TeamCode } = req.body;
    if (InvoiceID == null) {
        res.status(400).send("Missing Info");
        return;
    }
    const duplicate = yield firebase_1.db.collection("Queue").doc(InvoiceID).get();
    if (duplicate.exists) {
        res.status(409).send("Invoice Already Exists");
        return;
    }
    let now = new Date().getTime();
    let item = {
        invoiceCode: InvoiceID,
        teamCode: TeamCode,
        entryTimestamp: now,
        processTimestamp: 0,
        closeTimestamp: 0,
        openStatus: true,
        processing: false
    };
    firebase_1.db.collection("Queue").doc(InvoiceID).set(item);
    yield (0, ManageStats_1.incrementCurrentHour)(ManageStats_1.LogType.Queued);
    res.status(200).send("Opened Invoice");
}));
exports.invoice.post('/process', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { InvoiceID } = req.body;
    if (InvoiceID == null) {
        res.status(404).send("Missing Info");
        return;
    }
    let now = new Date().getTime();
    let x = firebase_1.db.collection("Queue").doc(InvoiceID).get();
    if (x.openStatus == false) {
        res.status(409).send("Invoice has already been completed.");
        return;
    }
    if (x.processing == true) {
        res.status(409).send("Invoice is already being processed.");
        return;
    }
    const invoice = firebase_1.db.collection("Queue").doc(InvoiceID);
    yield invoice.update({
        processing: true,
        processTimestamp: now
    });
    yield (0, ManageStats_1.incrementCurrentHour)(ManageStats_1.LogType.Processed);
    res.status(200).send("Processing Invoice");
}));
exports.invoice.post('/close', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { InvoiceID } = req.body;
    if (InvoiceID == null) {
        res.status(404).send("Missing Info");
        return;
    }
    let now = new Date().getTime();
    const invoice = firebase_1.db.collection("Queue").doc(InvoiceID);
    yield invoice.update({
        openStatus: false,
        processing: false,
        closeTimestamp: now
    });
    yield (0, ManageStats_1.incrementCurrentHour)(ManageStats_1.LogType.Completed);
    res.status(200).send("Closed Invoice");
}));
exports.invoice.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invoice = yield firebase_1.db.collection("Queue").where('openStatus', '==', true).get();
    let p = [];
    invoice.forEach((el) => {
        p.push(el.data());
    });
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(p));
}));
