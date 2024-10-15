import { incrementCurrentHour, LogType } from "../../../tools/Jobs/ManageStats"
import { db } from "../../../tools/firebase";
import express from "express";


export const invoice = express.Router();

invoice.post('/add', async (req,res) => 
{
    const {InvoiceID} = req.body;
    const {TeamCode} = req.body;

    if(InvoiceID == null){
        res.status(400).send("Missing Info");
        return;
    }

    
    const duplicate = await db.collection("Queue").doc(InvoiceID).get();
    
    if (duplicate.exists){
        res.status(409).send("Invoice Already Exists");
        return;
    }

    let now = new Date().getTime();

    let item : QueueItem = {
        invoiceCode : InvoiceID,
        teamCode : TeamCode,
        entryTimestamp : now,
        processTimestamp : 0,
        closeTimestamp : 0,
        openStatus : true,
        processing : false

    }

    db.collection("Queue").doc(InvoiceID).set(item);
    await incrementCurrentHour(LogType.Queued);

    res.status(200).send("Opened Invoice");
});
    
invoice.post('/process', async (req,res) => 
{
    const {InvoiceID} = req.body;

    if(InvoiceID == null){
        res.status(404).send("Missing Info");
        return;
    }

    let now = new Date().getTime();

    let x = db.collection("Queue").doc(InvoiceID).get();

    if(x.openStatus == false){
        res.status(409).send("Invoice has already been completed.");
        return;
    }

    if(x.processing == true){
        res.status(409).send("Invoice is already being processed.");
        return;
    }

    const invoice = db.collection("Queue").doc(InvoiceID);
    await invoice.update(
        {
            processing : true,
            processTimestamp : now
        }
    )

    await incrementCurrentHour(LogType.Processed);   
    res.status(200).send("Processing Invoice");
});

invoice.post('/close', async (req,res) => 
{
    const {InvoiceID} = req.body;

    if(InvoiceID == null){
        res.status(404).send("Missing Info");
        return;
    }

    let now = new Date().getTime();

    const invoice = db.collection("Queue").doc(InvoiceID);
    await invoice.update(
        {
            openStatus : false,
            processing : false,
            closeTimestamp : now
        }
    )

    await incrementCurrentHour(LogType.Completed);
    res.status(200).send("Closed Invoice");
});

invoice.get('/list', async (req,res) => 
{

    const invoice = await db.collection("Queue").where('openStatus', '==', true).get();

    let p : any[] = []
    invoice.forEach((el : any) => {
        p.push(el.data())
    });
    
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(p));
});

interface QueueItem{
    invoiceCode : string,
    teamCode : string,
    entryTimestamp : number,
    processTimestamp : number,
    closeTimestamp : number,
    openStatus : boolean,
    processing : boolean
}