import express from "express";
import {invoice} from "./Invoice/invoice"
import {getStatistics} from "./Statistics/GetStatistics"

export const v1 = express.Router();

v1.get('/', (req,res) => 
    {
        res.status(200).send("v1 Active");
    });

v1.use('/invoice', invoice);
v1.use('/statistics', getStatistics);
