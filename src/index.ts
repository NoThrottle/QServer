import express, {Express, Request, Response, NextFunction} from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { http, https } from 'follow-redirects';
import { routes } from './routes/routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 21560;

const ratelimits = rateLimit({
    windowMs : 60 * 1000,
    max : 45,
    message : "You have exceeded the rate limit.",
    headers : true
})

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  };

app.disable('x-powered-by');
app.use(ratelimits);
app.use(cors(corsOptions));
app.use(express.json());

const server = http.createServer(app);

server.listen(
    21560, "0.0.0.0",
    () => console.log(`http://localhost:${PORT}`)
);

app.use('/',routes)
