"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1 = void 0;
const express_1 = __importDefault(require("express"));
const invoice_1 = require("./Invoice/invoice");
const getStatistics_1 = require("./Statistics/getStatistics");
exports.v1 = express_1.default.Router();
exports.v1.get('/', (req, res) => {
    res.status(200).send("v1 Active");
});
exports.v1.use('/invoice', invoice_1.invoice);
exports.v1.use('/statistics', getStatistics_1.getStatistics);
