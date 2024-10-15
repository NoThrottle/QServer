"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
node_cron_1.default.schedule('0 0 * * *', () => {
    console.log('Executing task at 12:00 AM');
    // Your task logic here
});
node_cron_1.default.schedule('0 * * * *', () => {
    console.log('Executing task every hour');
    // Your task logic here
});
