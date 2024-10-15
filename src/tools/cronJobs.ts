import cron from 'node-cron';

cron.schedule('0 0 * * *', () => {
    console.log('Executing task at 12:00 AM');
    // Your task logic here
});


cron.schedule('0 * * * *', () => {
    console.log('Executing task every hour');
    // Your task logic here
});

