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
exports.sendVerificationEmail = exports.verify = void 0;
const express_1 = __importDefault(require("express"));
exports.verify = express_1.default.Router();
const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';
var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
function sendVerificationEmail(destinationEmail, username, verificationLink) {
    return __awaiter(this, void 0, void 0, function* () {
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail = {
            to: [{
                    email: 'ntyt.em@gmail.com',
                    name: username
                }],
            templateId: 1,
            params: {
                Player: username,
                verificationLink: verificationLink
            }
        };
        yield apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
            console.log('API called successfully. Returned data: ' + data);
            return true;
        }, function (error) {
            console.error(error);
            return false;
        });
        return false;
    });
}
exports.sendVerificationEmail = sendVerificationEmail;
