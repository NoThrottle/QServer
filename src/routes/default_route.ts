import { Router } from "express";

export const default_route = Router();

default_route.get('/', (req,res) => 
{
    res.status(200).send("Alive");
});


