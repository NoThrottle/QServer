"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const queue_management_735a4_firebase_adminsdk_8gtob_796be7c535_json_1 = __importDefault(require("../resources/queue-management-735a4-firebase-adminsdk-8gtob-796be7c535.json"));
initializeApp({
    credential: cert(queue_management_735a4_firebase_adminsdk_8gtob_796be7c535_json_1.default)
});
exports.db = getFirestore();
