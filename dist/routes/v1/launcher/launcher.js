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
exports.launcher = void 0;
const express_1 = __importDefault(require("express"));
const firebase_1 = require("../../../tools/firebase");
const accessTimer_1 = require("../access/accessTimer");
exports.launcher = express_1.default.Router();
exports.launcher.get('/launcherInfo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json(yield getLauncherInfo());
}));
exports.launcher.get('/minecraftInfo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _accessToken = 'access-token';
    const _username = 'username';
    const accessToken = req.headers[_accessToken] || '';
    const username = req.headers[_username] || '';
    if (!accessToken || !username) {
        return res.status(403).send("Access Token or Username is required");
    }
    if (!(0, accessTimer_1.isAuthorized)(accessToken, username)) {
        return res.status(403).send("Unauthorized: Bad Access Key or Wrong actor");
    }
    return res.status(200).json(yield getMinecraftInfo());
}));
let lastSeenModsVersion = 0;
let lastSeenModsList = "";
exports.launcher.post('/modsList', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (lastSeenModsVersion == 0) {
        let a = yield firebase_1.db.collection('ServerProperties').doc('MinecraftInfo').get();
        let b = a.data().modsVersion;
        lastSeenModsVersion = b;
        let h = yield firebase_1.db.collection('Mods').where('ClientSide', '==', true).get();
        let p = [];
        h.forEach((el) => {
            p.push(el.data());
        });
        lastSeenModsList = JSON.stringify(p);
    }
    const { "Installed Version": installedVersion } = req.body;
    const { "renew": renew } = req.body;
    if (!renew) {
        if (!installedVersion || installedVersion == 0) {
            return res.status(400).send("Need your version");
        }
        if (installedVersion == lastSeenModsVersion) {
            return res.status(200).send("Up to date");
        }
    }
    let a = yield firebase_1.db.collection('ServerProperties').doc('MinecraftInfo').get();
    let b = a.data().modsVersion;
    if (b == lastSeenModsVersion) {
        return res.status(200).send(lastSeenModsList);
    }
    lastSeenModsVersion = b;
    let h = yield firebase_1.db.collection('Mods').get();
    let p = [];
    h.forEach((el) => {
        p.push(el.data());
    });
    lastSeenModsList = JSON.stringify(p);
    return res.status(200).send(lastSeenModsList);
}));
function getNotifications() {
    return __awaiter(this, void 0, void 0, function* () {
        const x = yield firebase_1.db.collection('Notifications').get();
        let notifs = [];
        x.array.forEach((el) => {
            let y = el.data();
            let notif = {
                createdTimestamp: y.createdTimestamp,
                expiryTimestamp: y.expiryTimestamp,
                dontExpire: y.dontExpire,
                Title: y.Title,
                Content: y.Content,
                clickDestination: y.clickDestination,
                isURL: y.isURL,
                Appearance: y.Appearance
            };
            notifs.push(notif);
        });
        return notifs;
    });
}
function getMinecraftInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const x = yield firebase_1.db.collection('ServerProperties').doc('MinecraftInfo').get();
        if (!x.exists) {
            return null;
        }
        const y = x.data();
        let t = {
            fabricVersion: y.fabricVersion,
            minecraftVersion: y.minecraftVersion,
            modsVersion: y.modsVersion,
            serverAddress: y.serverAddress,
            serverPort: y.serverPort
        };
        return t;
    });
}
function getLauncherInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const x = yield firebase_1.db.collection('ServerProperties').doc('LauncherInfo').get();
        if (!x.exists) {
            return null;
        }
        const y = x.data();
        let t = {
            latestVersion: y.latestVersion,
            minimumVersion: y.minimumVersion,
            exeInstall: {
                URL: y.exeInstall.URL,
                Hash: y.exeInstall.Hash,
            },
            zipInstall: {
                URL: y.zipInstall.URL,
                Hash: y.zipInstall.Hash,
            }
        };
        return t;
    });
}
