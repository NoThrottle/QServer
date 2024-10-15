import express from "express";
import { default_route } from "./default_route";
import { v1 } from './v1/v1'

export const routes = express.Router();

routes.use(default_route);
routes.use('/v1',v1);