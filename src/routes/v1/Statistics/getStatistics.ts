import { incrementCurrentHour, LogType } from "../../../tools/Jobs/ManageStats"
import { db } from "../../../tools/firebase";
import express from "express";


export const getStatistics = express.Router();

getStatistics.get('/list', async (req,res) => 
{
    const date = req.query.date;
    res.setHeader("Content-Type", "application/json");

    if (date == null || date.length === 0){
        res.status(200).send(await getStatsFromToday());
    }
    else{

        let get = await getStatsFromDate(date.toString());
        
        if (get === null){
            res.status(404).send("Invalid Date");
        }
        else{
            res.status(200).send(get);
        }     
    }   
});


async function getStatsFromToday() : Promise<string|null> {

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0'); // Ensures two digits
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = now.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    return await getStatsFromDate(formattedDate);
}

async function getStatsFromDate(date: string) : Promise<string|null>{

    const curr = await db.collection("Historical Statistics").doc(date).get();

    if(!curr.exists){
        return null;
    }
    else{
        
        let a = curr.data();

        let q: number[] = [];
        if (a.Queued) {

            for (let i = 0; i <= 23; i++) {
                let hourKey = i.toString().padStart(2, '0') + "00";
    
                if (a.Queued[hourKey] !== undefined) {
                    q.push(a.Queued[hourKey]);
                } else {
                    q.push(-1);
                }
            }
        } else {
            q = Array(24).fill(-1);
        }

        let p: number[] = [];
        if (a.Processed) {

            for (let i = 0; i <= 23; i++) {
                let hourKey = i.toString().padStart(2, '0') + "00";
    
                if (a.Processed[hourKey] !== undefined) {
                    p.push(a.Processed[hourKey]);
                } else {
                    p.push(-1);
                }
            }
        } else {
            p = Array(24).fill(-1);
        }

        let c: number[] = [];
        if (a.Completed) {

            for (let i = 0; i <= 23; i++) {
                let hourKey = i.toString().padStart(2, '0') + "00";
    
                if (a.Completed[hourKey] !== undefined) {
                    c.push(a.Completed[hourKey]);
                } else {
                    c.push(-1);
                }
            }
        } else {
            c = Array(24).fill(-1);
        }

        let Stats : JSONStatistics = {
            total : {
                Queued : a.Queued?.total ?? 0,
                Processed : a.Processed?.total ?? 0,
                Completed : a.Completed?.total ?? 0,
                Backlog : a.Backlog?? 0
            },
            hourly : {
                Queued : q,
                Processed : p,
                Completed : c
            }
        }

        return JSON.stringify(Stats);

    }
}

interface JSONStatistics{
    total : {
        Queued: number,
        Processed: number,
        Completed: number,
        Backlog: number
    }
    hourly : {
        Queued: number[],
        Processed: number[],
        Completed: number[]
    }
}