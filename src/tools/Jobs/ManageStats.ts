import { db } from "../../tools/firebase";
import { increment } from "firebase/firestore";
import { FieldPath } from 'firebase-admin/firestore';

export async function incrementCurrentHour(type : LogType){

    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0'); // Ensures two digits
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = now.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    const hours = String(now.getHours()).padStart(2, '0'); // Get the hour in two digits
    const formattedHour = `${hours}00`

    const curr = db.collection("Historical Statistics").doc(formattedDate);
    const obtained = await curr.get();

    let typeText = LogType[type];

    if (!obtained.exists) {

        curr.set({
            [typeText]: {
                [formattedHour]: 1,
                total: 1
            }
        });

    } else {
        let hour = obtained.data()[typeText]?.[formattedHour];

        if (hour !== undefined) {

            curr.update({
                [`${typeText}.${formattedHour}`]: (hour + 1)
            });

        } else {

            await curr.update({
                [`${typeText}.${formattedHour}`]: 1 // Initialize this hour
            });

        }

        let total = obtained.data()[typeText]?.total;

        if (total !== undefined) {

            curr.update({
                [`${typeText}.total`]: (total + 1)
            });

        } else {

            await curr.update({
                [`${typeText}.total`]: 1
            });

        }


    }

}

export enum LogType{
    Queued,
    Completed,
    Processed,
}

interface Statistics{
    Backlog: number,
    Completed: number,
    Queued: number,
    Processing: number,
}

interface Backlog{
    total : number,
    stats : HourlyStats
}

interface Completed{
    total : number,
    stats : HourlyStats
}

interface Queued{
    total : number,
    stats : HourlyStats
}

interface Processing{
    total : number,
    stats : HourlyStats
}

interface HourlyStats{
    [key: string]: number
}