"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const follow_redirects_1 = require("follow-redirects");
const routes_1 = require("./routes/routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 21560;
const ratelimits = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 45,
    message: "You have exceeded the rate limit.",
    headers: true
});
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
};
app.disable('x-powered-by');
app.use(ratelimits);
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
const server = follow_redirects_1.http.createServer(app);
server.listen(21560, "0.0.0.0", () => console.log(`http://localhost:${PORT}`));
app.use('/', routes_1.routes);
