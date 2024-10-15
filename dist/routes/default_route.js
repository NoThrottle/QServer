"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default_route = void 0;
const express_1 = require("express");
exports.default_route = (0, express_1.Router)();
exports.default_route.get('/', (req, res) => {
    res.status(200).send("Alive");
});
