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
exports.default_route = void 0;
const firebase_1 = require("../tools/firebase");
const express_1 = require("express");
exports.default_route = (0, express_1.Router)();
exports.default_route.get('/', (req, res) => {
    res.status(200).send("Alive");
});
exports.default_route.post('/addInvoice', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    res.status(200).send("Opened Invoice");
}));
exports.default_route.post('/processInvoice', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    res.status(200).send("Processing Invoice");
}));
exports.default_route.post('/closeInvoice', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    res.status(200).send("Closed Invoice");
}));
exports.default_route.get('/invoiceList', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invoice = yield firebase_1.db.collection("Queue").where('openStatus', '==', true).get();
    let p = [];
    invoice.forEach((el) => {
        p.push(el.data());
    });
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(p));
}));
